import { Loader2, Trash } from 'lucide-react'
import { useState } from 'react'
import { generatePath, Link } from 'react-router-dom'
import { toast } from 'sonner'

import type { Project, ProjectMembership } from '@/domain/types.ts'
import type { GetCurrentUserRoleUseCase } from '@/domain/use-cases/memberships/get-current-user-role'
import type { GetMembershipsUseCase } from '@/domain/use-cases/memberships/get-memberships'
import type { RemoveMemberUseCase } from '@/domain/use-cases/memberships/remove-member'

import { useCurrentUserRoleQuery } from '@/app/query-hooks/memberships/get-current-user-role'
import { useMembershipsQuery } from '@/app/query-hooks/memberships/get-memberships'
import { useRemoveMemberMutation } from '@/app/query-hooks/memberships/remove-member'
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

export function ProjectMembersPage({
  projectId,
  useCases,
}: {
  projectId: Project['id']
  useCases: {
    getCurrentUserRoleUseCase: GetCurrentUserRoleUseCase
    getMembershipsUseCase: GetMembershipsUseCase
    removeMemberUseCase: RemoveMemberUseCase
  }
}) {
  const {
    data: members = [],
    error: membersError,
    isLoading: membersLoading,
  } = useMembershipsQuery(projectId, useCases.getMembershipsUseCase)
  const {
    data: currentUserRole,
    error: roleError,
    isLoading: roleLoading,
  } = useCurrentUserRoleQuery(projectId, useCases.getCurrentUserRoleUseCase)
  const { isPending: isRemoving, mutate: removeMember } =
    useRemoveMemberMutation(projectId, useCases.removeMemberUseCase)

  const [memberToRemove, setMemberToRemove] =
    useState<null | ProjectMembership>(null)

  const isLoading = membersLoading || roleLoading
  const error = membersError || roleError

  const canManage = currentUserRole === 'admin'

  const confirmRemoveMember = () => {
    if (memberToRemove) {
      removeMember(
        { projectId, userId: memberToRemove.id },
        {
          onError: (err) => {
            toast.error(`Failed to remove member: ${err.message}`)
          },
          onSuccess: () => {
            toast.success('Member removed successfully')
            setMemberToRemove(null)
          },
        },
      )
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Manage who has access to this project
            </CardDescription>
          </div>
          {canManage && (
            <Button
              asChild
              size="sm"
              variant="outline">
              <Link
                to={generatePath(ROUTES.PROJECT_SETTINGS_MEMBERS_CREATE, {
                  projectId,
                })}>
                Add Member
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} />
            ) : members.length > 0 ? (
              <MembersList
                currentUserRole={currentUserRole}
                members={members}
                onRemoveMember={setMemberToRemove}
              />
            ) : (
              <EmptyState text="No project members have been added yet." />
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        open={!!memberToRemove}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {memberToRemove?.user.name} from the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={isRemoving}
              onClick={confirmRemoveMember}>
              {isRemoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function MembersList({
  currentUserRole,
  members,
  onRemoveMember,
}: {
  currentUserRole?: 'admin' | 'member' | 'viewer'
  members: ProjectMembership[]
  onRemoveMember: (member: ProjectMembership) => void
}) {
  const canRemoveMembers = currentUserRole === 'admin'

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          className="bg-card flex items-center justify-between rounded-md border p-3"
          key={member.id}>
          <div className="flex items-center">
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-xs font-medium">
                {member.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{member.user.name}</p>
              <p className="text-muted-foreground text-xs">
                {member.user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm capitalize">
              {member.role}
            </span>
            {canRemoveMembers && member.role !== 'admin' && (
              <Button
                className="text-destructive size-4"
                onClick={() => onRemoveMember(member)}
                size="icon"
                variant="ghost">
                <Trash></Trash>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
