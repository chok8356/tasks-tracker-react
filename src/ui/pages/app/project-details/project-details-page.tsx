import { Columns3Cog, LayoutListIcon, SettingsIcon } from 'lucide-react'
import { generatePath, Link, Outlet } from 'react-router-dom'

import type { Project } from '@/domain/types.ts'
import type { GetProject } from '@/features/projects/actions.ts'

import { ErrorState } from '@/ui/components/error-state'
import { LoadingState } from '@/ui/components/loading-state'
import { useProjectQuery } from '@/ui/query-hooks/projects/get-project'
import { ROUTES } from '@/ui/router/routes'
import { Button } from '@/ui/shadcn/components/ui/button'

export function ProjectDetailsPage({
  deps,
  projectId,
}: {
  deps: {
    getProject: GetProject
  }
  projectId: Project['id']
}) {
  const { data: projectResult, isLoading } = useProjectQuery(
    projectId,
    deps.getProject,
  )

  const error = projectResult && !projectResult.ok ? projectResult.error : null
  const project = projectResult?.ok ? projectResult.value : null

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {project?.name}
        </h1>
        <div className="flex gap-2">
          <Button
            asChild
            variant="ghost">
            <Link
              to={generatePath(ROUTES.PROJECT_ISSUES_CREATE, { projectId })}>
              Create Issue
            </Link>
          </Button>
          <Button
            asChild
            variant="outline">
            <Link to={generatePath(ROUTES.PROJECT, { projectId })}>
              <Columns3Cog />
              Board
            </Link>
          </Button>
          <Button
            asChild
            variant="outline">
            <Link to={generatePath(ROUTES.PROJECT_BACKLOG, { projectId })}>
              <LayoutListIcon />
              Backlog
            </Link>
          </Button>
          <Button
            asChild
            variant="outline">
            <Link
              to={generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES, {
                projectId,
              })}>
              <SettingsIcon></SettingsIcon>
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
