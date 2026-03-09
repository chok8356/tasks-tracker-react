import type { ChangeEvent, SetStateAction } from 'react'

import { TagIcon, UsersIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import type { Issue, IssueType, Project } from '@/domain/types.ts'
import type { GetIssueStatuses } from '@/features/issue-statuses/actions.ts'
import type { GetIssueTypes } from '@/features/issue-types/actions.ts'
import type {
  BulkUpdateIssues,
  GetBoardIssues,
} from '@/features/issues/actions.ts'
import type { GetMemberships } from '@/features/memberships/actions.ts'
import type { InfraError } from '@/shared/result.ts'

import { EmptyState } from '@/ui/components/empty-state'
import { ErrorState } from '@/ui/components/error-state'
import { LoadingState } from '@/ui/components/loading-state'
import { useIssueStatusesQuery } from '@/ui/query-hooks/issue-statuses/get-issue-statuses'
import { useIssueTypesQuery } from '@/ui/query-hooks/issue-types/get-issue-types'
import { useBulkUpdateIssuesMutation } from '@/ui/query-hooks/issues/bulk-update-issues'
import { useBoardIssuesQuery } from '@/ui/query-hooks/issues/get-board-issues'
import { useMembershipsQuery } from '@/ui/query-hooks/memberships/get-memberships'
import { Button } from '@/ui/shadcn/components/ui/button'
import { Input } from '@/ui/shadcn/components/ui/input'
import { MultiSelect } from '@/ui/shadcn/components/ui/multi-select'

import { BoardIssues } from './children/board-issues'

const useProjectBoardData = (
  projectId: Project['id'],
  useCases: {
    getBoardIssues: GetBoardIssues
    getIssueStatuses: GetIssueStatuses
    getIssueTypes: GetIssueTypes
    getMemberships: GetMemberships
  },
) => {
  const { data: issuesResult, isLoading: issuesLoading } = useBoardIssuesQuery(
    projectId,
    useCases.getBoardIssues,
  )
  const { data: statusesResult, isLoading: statusesLoading } =
    useIssueStatusesQuery(projectId, useCases.getIssueStatuses)
  const { data: typesResult, isLoading: typesLoading } = useIssueTypesQuery(
    projectId,
    useCases.getIssueTypes,
  )
  const { data: membersResult, isLoading: membersLoading } =
    useMembershipsQuery(projectId, useCases.getMemberships)

  const isLoading =
    issuesLoading || statusesLoading || typesLoading || membersLoading
  const error: InfraError | null =
    issuesResult && !issuesResult.ok
      ? issuesResult.error
      : statusesResult && !statusesResult.ok
        ? statusesResult.error
        : typesResult && !typesResult.ok
          ? typesResult.error
          : membersResult && !membersResult.ok
            ? membersResult.error
            : null

  const issues = useMemo(() => {
    const issuesData = issuesResult?.ok ? issuesResult.value : []
    return issuesData.reduce(
      (acc, issue) => {
        acc[issue.id] = { ...issue, order: issue.order }
        return acc
      },
      {} as Record<string, Issue>,
    )
  }, [issuesResult])

  const types = useMemo(() => {
    const typesData = typesResult?.ok ? typesResult.value : []
    return typesData.reduce(
      (acc, type) => {
        acc[type.id] = type
        return acc
      },
      {} as Record<string, IssueType>,
    )
  }, [typesResult])

  return {
    error,
    isLoading,
    issues,
    members: membersResult?.ok ? membersResult.value : [],
    statuses: statusesResult?.ok ? statusesResult.value : [],
    types,
  }
}

export function ProjectBoardPage({
  projectId,
  useCases,
}: {
  projectId: Project['id']
  useCases: {
    bulkUpdateIssues: BulkUpdateIssues
    getBoardIssues: GetBoardIssues
    getIssueStatuses: GetIssueStatuses
    getIssueTypes: GetIssueTypes
    getMemberships: GetMemberships
  }
}) {
  const { error, isLoading, issues, members, statuses, types } =
    useProjectBoardData(projectId, useCases)
  const [localIssues, setLocalIssues] = useState<
    Record<string, Issue> | undefined
  >(issues)

  const { mutate: bulkUpdate } = useBulkUpdateIssuesMutation(
    projectId,
    useCases.bulkUpdateIssues,
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    memberIds: [] as string[],
    typeIds: [] as string[],
  })

  useEffect(() => {
    setLocalIssues(issues)
  }, [issues])

  const filteredIssues = useMemo(() => {
    if (!localIssues) return {}

    let filtered = Object.values(localIssues)

    if (searchQuery) {
      filtered = filtered.filter((issue) =>
        issue.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filters.memberIds.length > 0) {
      filtered = filtered.filter((issue) =>
        filters.memberIds.includes(issue.assigneeId ?? ''),
      )
    }

    if (filters.typeIds.length > 0) {
      filtered = filtered.filter((issue) =>
        filters.typeIds.includes(issue.typeId),
      )
    }

    return filtered.reduce(
      (acc, issue) => {
        acc[issue.id] = issue
        return acc
      },
      {} as Record<Issue['id'], Issue>,
    )
  }, [localIssues, searchQuery, filters])

  const handleIssuesChange = (
    action: SetStateAction<Record<Issue['id'], Issue>>,
  ) => {
    const oldIssues = localIssues ?? {}
    const newIssues = typeof action === 'function' ? action(oldIssues) : action

    setLocalIssues(newIssues)

    const updates: Pick<Issue, 'id' | 'order' | 'statusId'>[] = []

    Object.keys(newIssues).forEach((issueId) => {
      const oldIssue = oldIssues[issueId]
      const newIssue = newIssues[issueId]
      if (!newIssue) return
      if (
        !oldIssue ||
        oldIssue.statusId !== newIssue.statusId ||
        oldIssue.order !== newIssue.order
      ) {
        updates.push({
          id: issueId,
          order: newIssue.order,
          statusId: newIssue.statusId,
        })
      }
    })

    if (updates.length > 0) {
      bulkUpdate(
        { projectId, updates },
        {
          onSuccess: (res) => {
            if (!res.ok) {
              toast.error('Failed to update issues')
              setLocalIssues(oldIssues)
            }
          },
        },
      )
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          className="w-auto"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Search issues..."
          value={searchQuery}
        />
        <MultiSelect
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, memberIds: value }))
          }
          options={
            members?.map((member) => ({
              label: member.user.name,
              value: member.id,
            })) ?? []
          }
          trigger={
            <Button
              className="w-auto justify-start text-left"
              variant="outline">
              <UsersIcon className="text-muted-foreground mr-2 h-4 w-4" />
              Assignee
              {filters.memberIds.length > 0 && (
                <span className="bg-muted py-0xs ml-auto rounded px-1 text-xs font-normal">
                  {filters.memberIds.length}
                </span>
              )}
            </Button>
          }
          value={filters.memberIds}
        />
        <MultiSelect
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, typeIds: value }))
          }
          options={
            types
              ? Object.values(types).map((type) => ({
                  label: type.name,
                  value: type.id,
                }))
              : []
          }
          trigger={
            <Button
              className="w-auto justify-start text-left"
              variant="outline">
              <TagIcon className="text-muted-foreground mr-2 h-4 w-4" />
              Type
              {filters.typeIds.length > 0 && (
                <span className="bg-muted py-0xs ml-auto rounded px-1 text-xs font-normal">
                  {filters.typeIds.length}
                </span>
              )}
            </Button>
          }
          value={filters.typeIds}
        />
      </div>
      <div className="h-[calc(100vh-152px)]">
        {localIssues && Object.keys(filteredIssues).length > 0 ? (
          <BoardIssues
            issues={filteredIssues}
            members={members}
            onIssuesChange={handleIssuesChange}
            projectId={projectId}
            statuses={statuses}
            types={types}
          />
        ) : (
          <EmptyState
            text={
              searchQuery
                ? 'No issues found for your search.'
                : 'No issues have been created yet.'
            }
          />
        )}
      </div>
    </div>
  )
}
