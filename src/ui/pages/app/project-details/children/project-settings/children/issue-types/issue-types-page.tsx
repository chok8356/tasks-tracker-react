import { Loader2, Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { generatePath, Link } from 'react-router-dom'
import { toast } from 'sonner'

import type { IssueType, Project } from '@/domain/types.ts'
import type { DeleteIssueTypeUseCase } from '@/domain/use-cases/issue-types/delete-issue-type'
import type { GetIssueTypesUseCase } from '@/domain/use-cases/issue-types/get-issue-types'
import type { GetCurrentUserRoleUseCase } from '@/domain/use-cases/memberships/get-current-user-role'

import { useDeleteIssueTypeMutation } from '@/app/query-hooks/issue-types/delete-issue-type'
import { useIssueTypesQuery } from '@/app/query-hooks/issue-types/get-issue-types'
import { useCurrentUserRoleQuery } from '@/app/query-hooks/memberships/get-current-user-role'
import { getIssueIcon } from '@/shared/constants/issue-constants.tsx'
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

export function IssueTypesPage({
  projectId,
  useCases,
}: {
  projectId: Project['id']
  useCases: {
    deleteIssueTypeUseCase: DeleteIssueTypeUseCase
    getCurrentUserRoleUseCase: GetCurrentUserRoleUseCase
    getIssueTypesUseCase: GetIssueTypesUseCase
  }
}) {
  const {
    data: issueTypes,
    error: typesError,
    isLoading: typesLoading,
  } = useIssueTypesQuery(projectId, useCases.getIssueTypesUseCase)
  const {
    data: currentUserRole,
    error: roleError,
    isLoading: roleLoading,
  } = useCurrentUserRoleQuery(projectId, useCases.getCurrentUserRoleUseCase)
  const { isPending: isDeleting, mutate: deleteType } =
    useDeleteIssueTypeMutation(projectId, useCases.deleteIssueTypeUseCase)

  const [typeToDelete, setTypeToDelete] = useState<IssueType | null>(null)

  const isLoading = typesLoading || roleLoading
  const error = typesError || roleError

  const canManage = currentUserRole === 'admin'

  const confirmDeleteType = () => {
    if (!typeToDelete) return
    deleteType(typeToDelete.id, {
      onError: (err) => {
        toast.error(`Failed to delete type: ${err.message}`)
      },
      onSuccess: () => {
        toast.success('Issue type deleted successfully.')
        setTypeToDelete(null)
      },
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Issue Types</CardTitle>
            <CardDescription>
              Manage the types of issues in this project
            </CardDescription>
          </div>
          {canManage && (
            <Button
              asChild
              size="sm"
              variant="outline">
              <Link
                to={generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES_CREATE, {
                  projectId,
                })}>
                Create Type
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} />
            ) : issueTypes && issueTypes.length > 0 ? (
              <TypesList
                canManage={canManage}
                issueTypes={issueTypes}
                onDeleteIssueType={setTypeToDelete}
                projectId={projectId}
              />
            ) : (
              <EmptyState text="No issue types have been created yet." />
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        onOpenChange={(open) => !open && setTypeToDelete(null)}
        open={!!typeToDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this type?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              issue type "{typeToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={confirmDeleteType}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function TypesList({
  canManage,
  issueTypes,
  onDeleteIssueType,
  projectId,
}: {
  canManage: boolean
  issueTypes: IssueType[]
  onDeleteIssueType: (type: IssueType) => void
  projectId: Project['id']
}) {
  return (
    <div className="space-y-3">
      {issueTypes.map((type) => (
        <div
          className="flex items-center justify-between rounded-md border p-2"
          key={type.id}>
          <div className="flex items-center gap-2">
            {getIssueIcon({
              className: 'size-4',
              color: type.color,
              icon: type.icon,
            })}
            <span className="text-sm font-medium">{type.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {canManage && (
              <Button
                asChild
                className="size-4"
                size="icon"
                variant="ghost">
                <Link
                  to={generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES_EDIT, {
                    projectId,
                    typeId: type.id,
                  })}>
                  <Pencil />
                </Link>
              </Button>
            )}
            {canManage && (
              <Button
                className="text-destructive size-4"
                onClick={() => onDeleteIssueType(type)}
                size="icon"
                variant="ghost">
                <Trash />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
