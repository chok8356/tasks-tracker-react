import { useState } from 'react'
import {
  generatePath,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { toast } from 'sonner'

import type { Project } from '@/domain/types.ts'
import type { GetCurrentUserRoleUseCase } from '@/domain/use-cases/memberships/get-current-user-role.ts'
import type { DeleteProjectUseCase } from '@/domain/use-cases/projects/delete-project.ts'

import { useCurrentUserRoleQuery } from '@/app/query-hooks/memberships/get-current-user-role.ts'
import { useDeleteProjectMutation } from '@/app/query-hooks/projects/delete-project.ts'
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
import { Tabs, TabsList, TabsTrigger } from '@/ui/shadcn/components/ui/tabs.tsx'

export function ProjectSettingsPage({
  projectId,
  useCases,
}: {
  projectId: Project['id']
  useCases: {
    deleteProjectUseCase: DeleteProjectUseCase
    getCurrentUserRoleUseCase: GetCurrentUserRoleUseCase
  }
}) {
  const navigate = useNavigate()
  const { data: currentUserRole } = useCurrentUserRoleQuery(
    projectId,
    useCases.getCurrentUserRoleUseCase,
  )
  const { isPending: isDeleting, mutate: deleteProject } =
    useDeleteProjectMutation(useCases.deleteProjectUseCase)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const canManage = currentUserRole === 'admin'

  function handleDelete() {
    setIsDeleteAlertOpen(true)
  }

  function confirmDelete() {
    deleteProject(projectId, {
      onError: (err) => {
        toast.error(`Failed to delete project: ${err.message}`)
      },
      onSuccess: () => {
        setIsDeleteAlertOpen(false)
        toast.success('Project deleted successfully')
        navigate(ROUTES.PROJECTS)
      },
    })
  }

  const PATHS = {
    members: {
      base: generatePath(ROUTES.PROJECT_SETTINGS_MEMBERS, { projectId }),
      create: generatePath(ROUTES.PROJECT_SETTINGS_MEMBERS_CREATE, {
        projectId,
      }),
      edit: '',
      label: 'Members',
    },
    statuses: {
      base: generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES, {
        projectId,
      }),
      create: generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_CREATE, {
        projectId,
      }),
      edit: generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_EDIT, {
        projectId,
        statusId: '',
      }),
      label: 'Issue Statuses',
    },
    types: {
      base: generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES, {
        projectId,
      }),
      create: generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES_CREATE, {
        projectId,
      }),
      edit: generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES_EDIT, {
        projectId,
        typeId: '',
      }),
      label: 'Issue Types',
    },
  } as const

  const TAB_ORDER: (keyof typeof PATHS)[] = ['types', 'statuses', 'members']

  type Tab = keyof typeof PATHS

  const location = useLocation()

  const getActiveTab = (): Tab => {
    const pathname = location.pathname
    return (
      TAB_ORDER.find((t) => {
        const { base, create: n, edit } = PATHS[t]
        return (
          pathname.includes(base) ||
          pathname.includes(n) ||
          pathname.includes(edit)
        )
      }) ?? TAB_ORDER[0]
    )
  }

  const isTab = (v: string): v is Tab =>
    Object.prototype.hasOwnProperty.call(PATHS, v)

  const handleTabChange = (value: string) => {
    if (isTab(value)) navigate(PATHS[value].base)
  }

  return (
    <>
      <div className="flex flex-col items-start gap-4">
        <Tabs
          onValueChange={handleTabChange}
          value={getActiveTab()}>
          <TabsList>
            {TAB_ORDER.map((key) => {
              return (
                <TabsTrigger
                  key={key}
                  value={key}>
                  {PATHS[key].label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
        <div className="w-full max-w-lg">
          <Outlet></Outlet>
        </div>

        {canManage && (
          <div className="mt-8 w-full max-w-xs">
            <h2 className="text-xl font-semibold tracking-tight">
              Delete Project
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Permanently delete this project and all of its data. This action
              cannot be undone.
            </p>
            <Button
              className="mt-4"
              onClick={handleDelete}
              variant="destructive">
              Delete Project
            </Button>
          </div>
        )}
      </div>

      <AlertDialog
        onOpenChange={setIsDeleteAlertOpen}
        open={isDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
