import { Columns3Cog, LayoutListIcon, SettingsIcon } from 'lucide-react'
import { generatePath, Link, Outlet } from 'react-router-dom'

import type { Project } from '@/domain/types.ts'
import type { GetProjectUseCase } from '@/domain/use-cases/projects/get-project'

import { useProjectQuery } from '@/app/query-hooks/projects/get-project'
import { ErrorState } from '@/ui/components/error-state'
import { LoadingState } from '@/ui/components/loading-state'
import { ROUTES } from '@/ui/router/routes'
import { Button } from '@/ui/shadcn/components/ui/button'

export function ProjectDetailsPage({
  projectId,
  useCases,
}: {
  projectId: Project['id']
  useCases: {
    getProjectUseCase: GetProjectUseCase
  }
}) {
  const {
    data: project,
    error,
    isLoading,
  } = useProjectQuery(projectId, useCases.getProjectUseCase)

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
