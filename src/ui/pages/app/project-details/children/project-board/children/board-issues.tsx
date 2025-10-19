import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { CSSProperties, Dispatch, Ref, SetStateAction } from 'react'

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { UserIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { generatePath, Link } from 'react-router-dom'

import type {
  Issue,
  IssueStatus,
  IssueType,
  Project,
  ProjectMembership,
} from '@/domain/types.ts'

import { getIssueIcon } from '@/shared/constants/issue-constants'
import { ROUTES } from '@/ui/router/routes'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/ui/shadcn/components/ui/avatar'
import { cn } from '@/ui/shadcn/lib/utils'

const BoardIssueContent = ({
  className,
  issue,
  members,
  projectId,
  ref,
  style,
  types,
  ...props
}: {
  className?: string
  issue: Issue
  members: Record<ProjectMembership['id'], ProjectMembership>
  projectId: Project['id']
  ref?: Ref<HTMLDivElement | null>
  style?: CSSProperties
  types: Record<IssueType['id'], IssueType>
}) => {
  const type = types[issue.typeId]
  const assignee = issue.assigneeId ? members[issue.assigneeId] : null

  return (
    <div
      className={cn(
        'bg-card rounded-lg border p-3 shadow-xs transition-colors will-change-transform',
        className,
      )}
      ref={ref}
      style={style}
      {...props}>
      <div className="text-foreground text-sm">
        <Link
          className="text-foreground text-sm hover:underline"
          state={{ from: 'board' }}
          to={generatePath(ROUTES.PROJECT_ISSUES_ISSUE, {
            issueId: issue.id,
            projectId,
          })}>
          {issue.summary}
        </Link>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1">
          <span className="bg-muted text-muted-foreground flex items-center gap-1 rounded-md px-1.5 py-0.5">
            {getIssueIcon({
              className: 'size-3.5',
              color: type.color,
              icon: type.icon,
            })}
            {issue.id}
          </span>
        </div>
        <span className="bg-muted ml-auto rounded-md px-2 py-0.5 text-center">
          {issue.estimate || '–'}
        </span>
        <Avatar className="h-6 w-6 rounded-md">
          <AvatarImage />
          <AvatarFallback className="rounded-md">
            {assignee ? (
              <>
                {assignee.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2)}
              </>
            ) : (
              <UserIcon
                className="text-muted-foreground"
                size={16}
              />
            )}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

const BoardIssue = ({
  issue,
  members,
  projectId,
  types,
}: {
  issue: Issue
  members: Record<ProjectMembership['id'], ProjectMembership>
  projectId: Project['id']
  types: Record<IssueType['id'], IssueType>
}) => {
  const { attributes, isDragging, listeners, setNodeRef } = useSortable({
    id: issue.id,
  })

  return (
    <BoardIssueContent
      className={cn(isDragging && 'bg-muted opacity-80')}
      issue={issue}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      members={members}
      projectId={projectId}
      types={types}
    />
  )
}

const BoardIssuePlaceholder = () => {
  return (
    <div className="absolute -top-1 left-1/2 mx-auto h-1 w-9/10 -translate-x-1/2 rounded-4xl bg-blue-400/50"></div>
  )
}

const BoardStatus = ({
  activeIssue,
  issues,
  members,
  placeholderIndex,
  projectId,
  status,
  types,
}: {
  activeIssue: Issue | null
  issues: Issue[]
  members: Record<ProjectMembership['id'], ProjectMembership>
  placeholderIndex: null | { index: number; statusId: IssueStatus['id'] }
  projectId: Project['id']
  status: IssueStatus
  types: Record<IssueType['id'], IssueType>
}) => {
  const { setNodeRef } = useDroppable({ id: status.id })
  const issueIds = useMemo(() => issues.map((c) => c.id), [issues])

  const isPlaceholderVisible = (index: number) =>
    placeholderIndex &&
    placeholderIndex.statusId === status.id &&
    placeholderIndex.index === index

  return (
    <div
      className="grid w-75 min-w-75 grid-rows-[auto_minmax(0,1fr)] items-stretch"
      ref={setNodeRef}>
      <div className="bg-background sticky top-0 z-2 flex items-center justify-between border border-b px-4 py-2">
        <span className="text-md font-semibold">{status.name}</span>
        <span className="bg-muted text-muted-foreground rounded-lg px-2 py-0.5 text-sm font-medium">
          {issues.length}
        </span>
      </div>
      <div className="bg-muted/30 flex flex-col gap-2 border border-t-0 px-2 py-4">
        <SortableContext
          items={issueIds}
          strategy={verticalListSortingStrategy}>
          {issues.map((issue, index) => (
            <div
              className="relative w-full"
              key={issue.id}>
              {isPlaceholderVisible(index) && activeIssue && (
                <BoardIssuePlaceholder />
              )}
              <BoardIssue
                issue={issue}
                members={members}
                projectId={projectId}
                types={types}
              />
            </div>
          ))}
          {isPlaceholderVisible(issues.length) && activeIssue && (
            <div className="relative w-full pt-1">
              <BoardIssuePlaceholder />
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  )
}

export const BoardIssues = ({
  issues,
  members,
  onIssuesChange,
  projectId,
  statuses,
  types,
}: {
  issues: Record<Issue['id'], Issue>
  members: ProjectMembership[]
  onIssuesChange: Dispatch<SetStateAction<Record<Issue['id'], Issue>>>
  projectId: Project['id']
  statuses: IssueStatus[]
  types: Record<IssueType['id'], IssueType>
}) => {
  const membersRecord = useMemo(() => {
    return members.reduce(
      (acc, member) => {
        acc[member.id] = member
        return acc
      },
      {} as Record<ProjectMembership['id'], ProjectMembership>,
    )
  }, [members])
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 1 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 1, tolerance: 1 },
    }),
  )

  const [activeIssue, setActiveIssue] = useState<Issue | null>(null)

  const [placeholderIndex, setPlaceholderIndex] = useState<null | {
    index: number
    statusId: IssueStatus['id']
  }>(null)

  const statusesWithIssues = useMemo(() => {
    return statuses.map((status) => {
      const statusIssues = Object.values(issues)
        .filter((issue) => issue.statusId === status.id)
        .sort((a, b) => a.order - b.order)
      return {
        ...status,
        issues: statusIssues,
      }
    })
  }, [statuses, issues])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const issue = issues[active.id]
    if (issue) {
      setActiveIssue(issue)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) {
      setPlaceholderIndex(null)
      return
    }

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) {
      setPlaceholderIndex(null)
      return
    }

    const overIssue = issues[overId]
    const overStatus = statusesWithIssues.find(
      (col) => col.id === overId || col.issues.some((c) => c.id === overId),
    )

    if (!overStatus) {
      setPlaceholderIndex(null)
      return
    }

    const overIndex = overIssue
      ? overStatus.issues.findIndex((c) => c.id === overId)
      : overStatus.issues.length

    setPlaceholderIndex({
      index: overIndex,
      statusId: overStatus.id,
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event
    const activeId = active.id

    if (placeholderIndex) {
      onIssuesChange((prev) => {
        const newIssues = { ...prev }
        const { index, statusId } = placeholderIndex

        const activeIssue = newIssues[activeId]
        if (!activeIssue) return prev

        const newStatus = statusId

        newIssues[activeId] = { ...activeIssue, statusId: newStatus }

        const allIssues = Object.values(newIssues).sort(
          (a, b) => a.order - b.order,
        )

        const activeIssueGlobalIndex = allIssues.findIndex(
          (c) => c.id === activeId,
        )
        if (activeIssueGlobalIndex === -1) return prev
        const [movedIssue] = allIssues.splice(activeIssueGlobalIndex, 1)

        const overStatusFilteredIssues = statusesWithIssues.find(
          (col) => col.id === newStatus,
        )?.issues

        let targetIssueId: null | string = null
        if (
          overStatusFilteredIssues &&
          index < overStatusFilteredIssues.length
        ) {
          targetIssueId = overStatusFilteredIssues[index].id
        }

        let globalInsertIndex = allIssues.length

        if (targetIssueId !== null) {
          const foundIndex = allIssues.findIndex((c) => c.id === targetIssueId)
          if (foundIndex !== -1) {
            globalInsertIndex = foundIndex
          }
        }

        allIssues.splice(globalInsertIndex, 0, movedIssue)

        allIssues.forEach((issue, i) => {
          newIssues[issue.id] = { ...newIssues[issue.id], order: i }
        })

        return newIssues
      })
    }

    setActiveIssue(null)
    setPlaceholderIndex(null)
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}>
      <div className="grid h-full auto-cols-max grid-flow-col items-stretch gap-2 overflow-auto">
        {statusesWithIssues.map((status) => (
          <BoardStatus
            activeIssue={activeIssue}
            issues={status.issues}
            key={status.id}
            members={membersRecord}
            placeholderIndex={placeholderIndex}
            projectId={projectId}
            status={status}
            types={types}
          />
        ))}
      </div>
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeIssue ? (
            <BoardIssueContent
              className="opacity-80"
              issue={activeIssue}
              members={membersRecord}
              projectId={projectId}
              types={types}
            />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
