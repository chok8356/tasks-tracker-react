import type { ChangeEvent, SetStateAction } from 'react'

import { FileCheckIcon, TagIcon, UsersIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import type { Issue, IssueType, Project } from '@/domain/types.ts'
import type { GetIssueStatusesUseCase } from '@/domain/use-cases/issue-statuses/get-issue-statuses'
import type { GetIssueTypesUseCase } from '@/domain/use-cases/issue-types/get-issue-types'
import type { BulkUpdateIssuesUseCase } from '@/domain/use-cases/issues/bulk-update-issues'
import type { DeleteIssueUseCase } from '@/domain/use-cases/issues/delete-issue'
import type { GetBacklogIssuesUseCase } from '@/domain/use-cases/issues/get-backlog-issues'
import type { GetBoardIssuesUseCase } from '@/domain/use-cases/issues/get-board-issues'
import type { MoveToBacklogUseCase } from '@/domain/use-cases/issues/move-to-backlog'
import type { MoveToBoardUseCase } from '@/domain/use-cases/issues/move-to-board'
import type { GetMembershipsUseCase } from '@/domain/use-cases/memberships/get-memberships'

import { useIssueStatusesQuery } from '@/app/query-hooks/issue-statuses/get-issue-statuses'
import { useIssueTypesQuery } from '@/app/query-hooks/issue-types/get-issue-types'
import { useBulkUpdateIssuesMutation } from '@/app/query-hooks/issues/bulk-update-issues'
import { useDeleteIssueMutation } from '@/app/query-hooks/issues/delete-issue'
import { useBacklogIssuesQuery } from '@/app/query-hooks/issues/get-backlog-issues'
import { useBoardIssuesQuery } from '@/app/query-hooks/issues/get-board-issues'
import { useMoveToBacklogMutation } from '@/app/query-hooks/issues/move-to-backlog'
import { useMoveToBoardMutation } from '@/app/query-hooks/issues/move-to-board'
import { useMembershipsQuery } from '@/app/query-hooks/memberships/get-memberships'
import { EmptyState } from '@/ui/components/empty-state'
import { ErrorState } from '@/ui/components/error-state'
import { LoadingState } from '@/ui/components/loading-state'
import { Button } from '@/ui/shadcn/components/ui/button'
import { Input } from '@/ui/shadcn/components/ui/input'
import { MultiSelect } from '@/ui/shadcn/components/ui/multi-select'

import { TableIssues } from './children/table-issues.tsx'

const useProjectBacklogData = (
  projectId: Project['id'],
  useCases: {
    getBacklogIssuesUseCase: GetBacklogIssuesUseCase
    getBoardIssuesUseCase: GetBoardIssuesUseCase
    getIssueStatusesUseCase: GetIssueStatusesUseCase
    getIssueTypesUseCase: GetIssueTypesUseCase
    getMembershipsUseCase: GetMembershipsUseCase
  },
) => {
  const {
    data: backlogData,
    error: backlogError,
    isLoading: backlogLoading,
  } = useBacklogIssuesQuery(projectId, useCases.getBacklogIssuesUseCase!)
  const {
    data: boardData,
    error: boardError,
    isLoading: boardLoading,
  } = useBoardIssuesQuery(projectId, useCases.getBoardIssuesUseCase!)
  const {
    data: statusesData,
    error: statusesError,
    isLoading: statusesLoading,
  } = useIssueStatusesQuery(projectId, useCases.getIssueStatusesUseCase!)
  const {
    data: typesData,
    error: typesError,
    isLoading: typesLoading,
  } = useIssueTypesQuery(projectId, useCases.getIssueTypesUseCase!)
  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useMembershipsQuery(projectId, useCases.getMembershipsUseCase!)

  const isLoading =
    backlogLoading ||
    boardLoading ||
    statusesLoading ||
    typesLoading ||
    membersLoading
  const error =
    backlogError || boardError || statusesError || typesError || membersError

  const issues = useMemo(() => {
    if (!backlogData) return undefined
    return backlogData.reduce(
      (acc, issue) => {
        acc[issue.id] = { ...issue, order: issue.order }
        return acc
      },
      {} as Record<string, Issue>,
    )
  }, [backlogData])

  const boardIssues = useMemo(() => {
    if (!boardData) return undefined
    return boardData.reduce(
      (acc, issue) => {
        acc[issue.id] = { ...issue, order: issue.order }
        return acc
      },
      {} as Record<string, Issue>,
    )
  }, [boardData])

  const types = useMemo(() => {
    if (!typesData) return undefined
    return typesData.reduce(
      (acc, type) => {
        acc[type.id] = type
        return acc
      },
      {} as Record<string, IssueType>,
    )
  }, [typesData])

  return {
    boardIssues,
    error,
    isLoading,
    issues,
    members: membersData,
    statuses: statusesData,
    types,
  }
}

export function ProjectBacklogPage({
  projectId,
  useCases,
}: {
  projectId: Project['id']
  useCases: {
    bulkUpdateIssuesUseCase: BulkUpdateIssuesUseCase
    deleteIssueUseCase: DeleteIssueUseCase
    getBacklogIssuesUseCase: GetBacklogIssuesUseCase
    getBoardIssuesUseCase: GetBoardIssuesUseCase
    getIssueStatusesUseCase: GetIssueStatusesUseCase
    getIssueTypesUseCase: GetIssueTypesUseCase
    getMembershipsUseCase: GetMembershipsUseCase
    moveToBacklogUseCase: MoveToBacklogUseCase
    moveToBoardUseCase: MoveToBoardUseCase
  }
}) {
  const { boardIssues, error, isLoading, issues, members, statuses, types } =
    useProjectBacklogData(projectId, useCases)

  const [localIssues, setLocalIssues] = useState<
    Record<string, Issue> | undefined
  >(issues)
  const [localBoardIssues, setLocalBoardIssues] = useState<
    Record<string, Issue> | undefined
  >(boardIssues)

  const { mutate: bulkUpdate } = useBulkUpdateIssuesMutation(
    projectId,
    useCases.bulkUpdateIssuesUseCase,
  )
  const { mutate: deleteIssue } = useDeleteIssueMutation(
    projectId,
    useCases.deleteIssueUseCase,
  )
  const { mutate: moveToBoard } = useMoveToBoardMutation(
    projectId,
    useCases.moveToBoardUseCase,
  )
  const { mutate: moveToBacklog } = useMoveToBacklogMutation(
    projectId,
    useCases.moveToBacklogUseCase,
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    memberIds: [] as string[],
    statusIds: [] as string[],
    typeIds: [] as string[],
  })

  useEffect(() => {
    setLocalIssues(issues)
  }, [issues])

  useEffect(() => {
    setLocalBoardIssues(boardIssues)
  }, [boardIssues])

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
    if (filters.statusIds.length > 0) {
      filtered = filtered.filter((issue) =>
        filters.statusIds.includes(issue.statusId),
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

  const filteredBoardIssues = useMemo(() => {
    if (!localBoardIssues) return {}
    let filtered = Object.values(localBoardIssues)
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
    if (filters.statusIds.length > 0) {
      filtered = filtered.filter((issue) =>
        filters.statusIds.includes(issue.statusId),
      )
    }
    return filtered.reduce(
      (acc, issue) => {
        acc[issue.id] = issue
        return acc
      },
      {} as Record<Issue['id'], Issue>,
    )
  }, [localBoardIssues, searchQuery, filters])

  const optimisticDeleteIssue = (issueId: Issue['id']) => {
    deleteIssue(issueId, {
      onError: (err) => toast.error(`Failed to delete issue: ${err.message}`),
      onSuccess: () => toast.success('Issue deleted successfully'),
    })
  }

  const optimisticMoveIssueToBoard = (issueId: Issue['id']) => {
    moveToBoard(
      { issueId, projectId },
      {
        onError: (err) =>
          toast.error(`Failed to move issue to board: ${err.message}`),
      },
    )
  }

  const optimisticMoveIssueToBacklog = (issueId: Issue['id']) => {
    moveToBacklog(
      { issueId, projectId },
      {
        onError: (err) =>
          toast.error(`Failed to move issue to backlog: ${err.message}`),
      },
    )
  }

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
          onError: (err) => {
            toast.error(`Failed to update backlog issues: ${err.message}`)
            setLocalIssues(oldIssues)
          },
        },
      )
    }
  }

  const handleBoardIssuesChange = (
    action: SetStateAction<Record<Issue['id'], Issue>>,
  ) => {
    const oldBoardIssues = localBoardIssues ?? {}
    const newBoardIssues =
      typeof action === 'function' ? action(oldBoardIssues) : action
    setLocalBoardIssues(newBoardIssues)

    const updates: Pick<Issue, 'id' | 'order' | 'statusId'>[] = []
    Object.keys(newBoardIssues).forEach((issueId) => {
      const oldIssue = oldBoardIssues[issueId]
      const newIssue = newBoardIssues[issueId]
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
          onError: (err) => {
            toast.error(`Failed to update board issues: ${err.message}`)
            setLocalBoardIssues(oldBoardIssues)
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
    <div className="space-y-4">
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
        <MultiSelect
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, statusIds: value }))
          }
          options={
            statuses?.map((status) => ({
              label: status.name,
              value: status.id,
            })) ?? []
          }
          trigger={
            <Button
              className="w-auto justify-start text-left"
              variant="outline">
              <FileCheckIcon className="text-muted-foreground mr-2 h-4 w-4" />
              Status
              {filters.statusIds.length > 0 && (
                <span className="bg-muted py-0xs ml-auto rounded px-1 text-xs font-normal">
                  {filters.statusIds.length}
                </span>
              )}
            </Button>
          }
          value={filters.statusIds}
        />
      </div>

      <div className="h-auto">
        <h2 className="mb-2 text-xl font-semibold">Board Issues</h2>
        {localBoardIssues && Object.keys(filteredBoardIssues).length > 0 ? (
          <TableIssues
            issues={filteredBoardIssues}
            members={members ?? []}
            onDeleteIssue={optimisticDeleteIssue}
            onIssuesChange={handleBoardIssuesChange}
            onMoveToBacklog={optimisticMoveIssueToBacklog}
            projectId={projectId}
            statuses={statuses ?? []}
            types={types ?? {}}
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

      <div className="h-auto">
        <h2 className="mb-2 text-xl font-semibold">Backlog Issues</h2>
        {localIssues && Object.keys(filteredIssues).length > 0 ? (
          <TableIssues
            issues={filteredIssues}
            members={members ?? []}
            onDeleteIssue={optimisticDeleteIssue}
            onIssuesChange={handleIssuesChange}
            onMoveToBoard={optimisticMoveIssueToBoard}
            projectId={projectId}
            statuses={statuses ?? []}
            types={types ?? {}}
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
