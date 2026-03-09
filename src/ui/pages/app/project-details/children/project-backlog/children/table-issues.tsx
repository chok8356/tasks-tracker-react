import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { CSSProperties, Dispatch, SetStateAction } from 'react'

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { MoreHorizontal, Trash2, UserIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { generatePath, Link } from 'react-router-dom'

import type {
  Issue,
  IssueStatus,
  IssueType,
  Project,
  ProjectMembership,
} from '@/domain/types.ts'

import { getIssueIcon } from '@/shared/constants/issue-constants.tsx'
import { getIssueStatus } from '@/shared/constants/project-constants.tsx'
import { ROUTES } from '@/ui/router/routes.ts'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/ui/shadcn/components/ui/avatar.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/shadcn/components/ui/dropdown-menu.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/ui/table.tsx'
import { cn } from '@/ui/shadcn/lib/utils.ts'

const TableIssueContent = ({
  className,
  issue,
  members,
  onDeleteIssue,
  onMoveToBacklog,
  onMoveToBoard,
  projectId,
  ref,
  statuses,
  style,
  types,
  ...props
}: {
  className?: string
  issue: Issue
  members: Record<ProjectMembership['id'], ProjectMembership>
  onDeleteIssue?: (issueId: Issue['id']) => void
  onMoveToBacklog?: (issueId: Issue['id']) => void
  onMoveToBoard?: (issueId: Issue['id']) => void
  projectId: Project['id']
  ref?: React.RefObject<HTMLTableRowElement | null>
  statuses: Record<IssueStatus['id'], IssueStatus>
  style?: CSSProperties
  types: Record<IssueType['id'], IssueType>
}) => {
  const type = types[issue.typeId]
  const assignee = issue.assigneeId ? members[issue.assigneeId] : null
  const status = statuses[issue.statusId]
  return (
    <TableRow
      className={cn('will-change-transform', className)}
      ref={ref}
      style={style}
      {...props}>
      <TableCell>
        <div className="grid auto-cols-max grid-flow-col items-center gap-1">
          {type
            ? getIssueIcon({
                className: 'size-4',
                color: type.color,
                icon: type.icon,
              })
            : null}
          <span className="text-muted-foreground text-sm">{issue.id}</span>
        </div>
      </TableCell>
      <TableCell className="w-full">
        <Link
          className="hover:underline"
          state={{ from: 'backlog' }}
          to={generatePath(ROUTES.PROJECT_ISSUES_ISSUE, {
            issueId: issue.id,
            projectId,
          })}>
          {issue.summary}
        </Link>
      </TableCell>
      <TableCell className="min-w-32">
        {status
          ? getIssueStatus({
              category: status.category,
              name: status.name,
            })
          : issue.statusId}
      </TableCell>
      <TableCell>
        <div className="bg-muted inline-block rounded-md px-2 py-1 text-center text-xs">
          {issue.estimate || '–'}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
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
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="text-muted-foreground hover:text-foreground rounded-md p-1">
              <MoreHorizontal size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onMoveToBoard && (
              <DropdownMenuItem onClick={() => onMoveToBoard(issue.id)}>
                <span>Move to board</span>
              </DropdownMenuItem>
            )}
            {onMoveToBacklog && (
              <DropdownMenuItem onClick={() => onMoveToBacklog(issue.id)}>
                <span>Move to backlog</span>
              </DropdownMenuItem>
            )}
            {onDeleteIssue && (
              <DropdownMenuItem onClick={() => onDeleteIssue(issue.id)}>
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

const TableIssue = ({
  issue,
  members,
  onDeleteIssue,
  onMoveToBacklog,
  onMoveToBoard,
  projectId,
  statuses,
  types,
}: {
  issue: Issue
  members: Record<ProjectMembership['id'], ProjectMembership>
  onDeleteIssue?: (issueId: Issue['id']) => void
  onMoveToBacklog?: (issueId: Issue['id']) => void
  onMoveToBoard?: (issueId: Issue['id']) => void
  projectId: Project['id']
  statuses: Record<IssueStatus['id'], IssueStatus>
  types: Record<IssueType['id'], IssueType>
}) => {
  const { attributes, isDragging, listeners, setNodeRef } = useSortable({
    id: issue.id,
  })

  const ref = React.useRef<HTMLTableRowElement>(null)

  React.useEffect(() => {
    setNodeRef(ref.current)
  }, [setNodeRef])

  return (
    <TableIssueContent
      className={cn(isDragging && 'bg-muted opacity-80')}
      issue={issue}
      ref={ref}
      statuses={statuses}
      types={types}
      {...attributes}
      {...listeners}
      members={members}
      onDeleteIssue={onDeleteIssue}
      onMoveToBacklog={onMoveToBacklog}
      onMoveToBoard={onMoveToBoard}
      projectId={projectId}
    />
  )
}

const TableIssuePlaceholder = () => {
  return (
    <TableRow className="relative border-0">
      <TableCell className="p-0">
        <div className="absolute -top-0.25 left-0 z-1 h-0.5 w-full bg-blue-400"></div>
      </TableCell>
    </TableRow>
  )
}

export const TableIssues = ({
  issues,
  members,
  onDeleteIssue,
  onIssuesChange,
  onMoveToBacklog,
  onMoveToBoard,
  projectId,
  statuses,
  types,
}: {
  issues: Record<Issue['id'], Issue>
  members: ProjectMembership[]
  onDeleteIssue?: (issueId: Issue['id']) => void
  onIssuesChange: Dispatch<SetStateAction<Record<Issue['id'], Issue>>>
  onMoveToBacklog?: (issueId: Issue['id']) => void
  onMoveToBoard?: (issueId: Issue['id']) => void
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
  const [placeholderIndex, setPlaceholderIndex] = useState<null | number>(null)
  const [activeIssueOriginalIndex, setActiveIssueOriginalIndex] = useState<
    null | number
  >(null)

  const sortedIssues = useMemo(() => {
    return Object.values(issues).sort((a, b) => a.order - b.order)
  }, [issues])

  const statusesMapper = useMemo(() => {
    const mapper: Record<IssueStatus['id'], IssueStatus> = {}
    statuses.forEach((status) => {
      mapper[status.id] = status
    })
    return mapper
  }, [statuses])

  const issueIds = useMemo(() => sortedIssues.map((c) => c.id), [sortedIssues])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const issue = issues[active.id]
    if (issue) {
      setActiveIssue(issue)
      const originalIndex = sortedIssues.findIndex((c) => c.id === issue.id)
      setActiveIssueOriginalIndex(originalIndex)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) {
      setPlaceholderIndex(sortedIssues.length)
      return
    }
    const activeId = active.id
    const overId = over.id
    if (activeId === overId) {
      setPlaceholderIndex(null)
      return
    }
    const overIndex = sortedIssues.findIndex((c) => c.id === overId)
    if (overIndex === -1) {
      setPlaceholderIndex(sortedIssues.length)
      return
    }
    let correctedIndex = overIndex
    if (
      activeIssueOriginalIndex !== null &&
      overIndex > activeIssueOriginalIndex
    ) {
      correctedIndex = overIndex + 1
    }
    setPlaceholderIndex(correctedIndex)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event
    const activeId = active.id
    if (
      placeholderIndex !== null &&
      placeholderIndex >= 0 &&
      activeIssueOriginalIndex !== null
    ) {
      if (activeIssueOriginalIndex !== placeholderIndex) {
        onIssuesChange((prev) => {
          const newIssues = { ...prev }
          const activeIssue = newIssues[activeId]
          if (!activeIssue) return prev

          const allIssues = Object.values(newIssues).sort(
            (a, b) => a.order - b.order,
          )

          const activeIssueGlobalIndex = allIssues.findIndex(
            (c) => c.id === activeId,
          )
          if (activeIssueGlobalIndex === -1) return prev
          const [movedIssue] = allIssues.splice(activeIssueGlobalIndex, 1)
          if (!movedIssue) return prev

          let globalInsertIndex = allIssues.length

          if (placeholderIndex < sortedIssues.length) {
            const overIssue = sortedIssues[placeholderIndex]
            if (overIssue) {
              const foundIndex = allIssues.findIndex(
                (c) => c.id === overIssue.id,
              )
              if (foundIndex !== -1) {
                globalInsertIndex = foundIndex
              }
            }
          }

          allIssues.splice(globalInsertIndex, 0, movedIssue)

          allIssues.forEach((issue, index) => {
            const existingIssue = newIssues[issue.id]
            if (!existingIssue) return
            newIssues[issue.id] = { ...existingIssue, order: index }
          })
          return newIssues
        })
      }
    }
    setActiveIssue(null)
    setPlaceholderIndex(null)
    setActiveIssueOriginalIndex(null)
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead className="w-full">Title</TableHead>
            <TableHead className="min-w-32">Status</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext
            items={issueIds}
            strategy={verticalListSortingStrategy}>
            {sortedIssues.map((issue, index) => (
              <React.Fragment key={issue.id}>
                {placeholderIndex === index && <TableIssuePlaceholder />}
                <TableIssue
                  issue={issue}
                  members={membersRecord}
                  onDeleteIssue={onDeleteIssue}
                  onMoveToBacklog={onMoveToBacklog}
                  onMoveToBoard={onMoveToBoard}
                  projectId={projectId}
                  statuses={statusesMapper}
                  types={types}
                />
              </React.Fragment>
            ))}
            {placeholderIndex === sortedIssues.length &&
              sortedIssues.length > 0 && <TableIssuePlaceholder />}
          </SortableContext>
        </TableBody>
      </Table>
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeIssue ? (
            <Table>
              <TableBody>
                <TableIssueContent
                  className="opacity-80 shadow-lg"
                  issue={activeIssue}
                  members={membersRecord}
                  onDeleteIssue={onDeleteIssue}
                  onMoveToBacklog={onMoveToBacklog}
                  onMoveToBoard={onMoveToBoard}
                  projectId={projectId}
                  statuses={statusesMapper}
                  types={types}
                />
              </TableBody>
            </Table>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
