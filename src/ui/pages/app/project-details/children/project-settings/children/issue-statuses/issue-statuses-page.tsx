import type { DragEndEvent } from '@dnd-kit/core'

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Loader2, Pencil, Trash } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { generatePath, Link } from 'react-router-dom'
import { toast } from 'sonner'

import type { IssueStatus, Project } from '@/domain/types.ts'
import type { BulkUpdateIssueStatusesUseCase } from '@/domain/use-cases/issue-statuses/bulk-update-issue-statuses'
import type { DeleteIssueStatusUseCase } from '@/domain/use-cases/issue-statuses/delete-issue-status'
import type { GetIssueStatusesUseCase } from '@/domain/use-cases/issue-statuses/get-issue-statuses'
import type { GetCurrentUserRoleUseCase } from '@/domain/use-cases/memberships/get-current-user-role'

import { useBulkUpdateIssueStatusesMutation } from '@/app/query-hooks/issue-statuses/bulk-update-issue-statuses'
import { useDeleteIssueStatusMutation } from '@/app/query-hooks/issue-statuses/delete-issue-status'
import { useIssueStatusesQuery } from '@/app/query-hooks/issue-statuses/get-issue-statuses'
import { useCurrentUserRoleQuery } from '@/app/query-hooks/memberships/get-current-user-role'
import { getIssueStatus } from '@/shared/constants/project-constants.tsx'
import { EmptyState } from '@/ui/components/empty-state'
import { ErrorState } from '@/ui/components/error-state'
import { LoadingState } from '@/ui/components/loading-state'
import { ROUTES } from '@/ui/router/routes.ts'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/shadcn/components/ui/alert-dialog.tsx'
import { Button } from '@/ui/shadcn/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/shadcn/components/ui/card.tsx'
import { cn } from '@/ui/shadcn/lib/utils.ts'

export function IssueStatusesPage({
  projectId,
  useCases,
}: {
  projectId: Project['id']
  useCases: {
    bulkUpdateIssueStatusesUseCase: BulkUpdateIssueStatusesUseCase
    deleteIssueStatusUseCase: DeleteIssueStatusUseCase
    getCurrentUserRoleUseCase: GetCurrentUserRoleUseCase
    getIssueStatusesUseCase: GetIssueStatusesUseCase
  }
}) {
  const {
    data: issueStatuses,
    error: statusesError,
    isLoading: statusesLoading,
  } = useIssueStatusesQuery(projectId, useCases.getIssueStatusesUseCase)
  const {
    data: currentUserRole,
    error: roleError,
    isLoading: roleLoading,
  } = useCurrentUserRoleQuery(projectId, useCases.getCurrentUserRoleUseCase)
  const { isPending: isDeleting, mutate: deleteStatus } =
    useDeleteIssueStatusMutation(projectId, useCases.deleteIssueStatusUseCase)
  const { mutate: bulkUpdateStatuses } = useBulkUpdateIssueStatusesMutation(
    projectId,
    useCases.bulkUpdateIssueStatusesUseCase,
  )

  const [statusToDelete, setStatusToDelete] = useState<IssueStatus | null>(null)

  const isLoading = statusesLoading || roleLoading
  const error = statusesError || roleError

  const canManage = currentUserRole === 'admin'

  const confirmDeleteStatus = () => {
    if (!statusToDelete) return
    deleteStatus(statusToDelete.id, {
      onError: (err) => {
        toast.error(`Failed to delete status: ${err.message}`)
      },
      onSuccess: () => {
        setStatusToDelete(null)
        toast.success('Status deleted successfully')
      },
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Issue Statuses</CardTitle>
            <CardDescription>
              Manage the statuses of issues in this project
            </CardDescription>
          </div>
          {canManage && (
            <Button
              asChild
              size="sm"
              variant="outline">
              <Link
                to={generatePath(
                  ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_CREATE,
                  {
                    projectId,
                  },
                )}>
                Create Status
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} />
          ) : issueStatuses && issueStatuses.length > 0 ? (
            <StatusesList
              bulkUpdateStatuses={bulkUpdateStatuses}
              canManage={canManage}
              issueStatuses={issueStatuses}
              onDeleteIssueStatus={setStatusToDelete}
              projectId={projectId}
            />
          ) : (
            <EmptyState text="No issue statuses have been created yet." />
          )}
        </CardContent>
      </Card>

      <AlertDialog
        onOpenChange={(open) => !open && setStatusToDelete(null)}
        open={!!statusToDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this status?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              issue status "{statusToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={confirmDeleteStatus}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

const SortableStatusItem = ({
  canManage,
  onDeleteIssueStatus,
  projectId,
  status,
}: {
  canManage: boolean
  onDeleteIssueStatus: (status: IssueStatus) => void
  projectId: Project['id']
  status: IssueStatus
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: status.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      className={cn(
        'bg-card relative flex items-center justify-between rounded-md border p-2',
        isDragging ? 'bg-muted z-10 opacity-80' : 'z-0 opacity-100',
      )}
      ref={setNodeRef}
      style={style}>
      <div className="flex flex-1 items-center gap-2">
        {canManage && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing">
            <GripVertical className="size-4" />
          </div>
        )}
        <span className="text-sm font-medium">
          {getIssueStatus({ category: status.category, name: status.name })}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {canManage && (
          <Button
            asChild
            className="size-4"
            size="icon"
            variant="ghost">
            <Link
              to={generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_EDIT, {
                projectId,
                statusId: status.id,
              })}>
              <Pencil />
            </Link>
          </Button>
        )}
        {canManage && (
          <Button
            className="text-destructive size-4"
            onClick={() => onDeleteIssueStatus(status)}
            size="icon"
            variant="ghost">
            <Trash />
          </Button>
        )}
      </div>
    </div>
  )
}

function StatusesList({
  bulkUpdateStatuses,
  canManage,
  issueStatuses,
  onDeleteIssueStatus,
  projectId,
}: {
  bulkUpdateStatuses: (
    variables: {
      projectId: string
      updates: { id: string; name: string; order: number }[]
    },
    options?: { onError?: (error: any) => void; onSuccess?: () => void },
  ) => void
  canManage: boolean
  issueStatuses: IssueStatus[]
  onDeleteIssueStatus: (status: IssueStatus) => void
  projectId: Project['id']
}) {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const [localStatuses, setLocalStatuses] = useState<IssueStatus[]>([])

  useEffect(() => {
    setLocalStatuses(issueStatuses)
  }, [issueStatuses])

  const statusIds = useMemo(
    () => localStatuses.map((status) => status.id),
    [localStatuses],
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const originalStatuses = [...localStatuses]

      const oldIndex = localStatuses.findIndex((s) => s.id === active.id)
      const newIndex = localStatuses.findIndex((s) => s.id === over.id)

      const newStatuses = [...localStatuses]
      const [movedStatus] = newStatuses.splice(oldIndex, 1)
      newStatuses.splice(newIndex, 0, movedStatus)

      setLocalStatuses(newStatuses)

      const updates = newStatuses.map((status, index) => ({
        id: status.id,
        name: status.name,
        order: index,
      }))

      bulkUpdateStatuses(
        { projectId, updates },
        {
          onError: (err) => {
            toast.error(`Failed to update status order: ${err.message}`)
            setLocalStatuses(originalStatuses)
          },
          onSuccess: () => {
            toast.success('Status order updated successfully')
          },
        },
      )
    }
  }

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      onDragEnd={handleDragEnd}
      sensors={sensors}>
      <SortableContext
        items={statusIds}
        strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {localStatuses.map((status) => (
            <SortableStatusItem
              canManage={canManage}
              key={status.id}
              onDeleteIssueStatus={onDeleteIssueStatus}
              projectId={projectId}
              status={status}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
