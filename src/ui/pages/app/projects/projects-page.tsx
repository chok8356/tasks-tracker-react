import { generatePath, Link } from 'react-router-dom'

import type { Project } from '@/domain/types.ts'
import type { GetProjects } from '@/features/projects/actions.ts'

import { EmptyState } from '@/ui/components/empty-state'
import { ErrorState } from '@/ui/components/error-state'
import { LoadingState } from '@/ui/components/loading-state'
import { useProjectsQuery } from '@/ui/query-hooks/projects/get-projects'
import { ROUTES } from '@/ui/router/routes.ts'
import { Button } from '@/ui/shadcn/components/ui/button.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/ui/table.tsx'

export function ProjectsPage({
  deps,
}: {
  deps: {
    getProjects: GetProjects
  }
}) {
  const { data: projectsResult, isLoading } = useProjectsQuery(deps.getProjects)

  const error =
    projectsResult && !projectsResult.ok ? projectsResult.error : null
  const projects = projectsResult?.ok ? projectsResult.value : []

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <Button
          asChild
          variant="outline">
          <Link to={generatePath(ROUTES.PROJECTS_CREATE)}>Create Project</Link>
        </Button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : projects.length > 0 ? (
        <ProjectsTable projects={projects} />
      ) : (
        <EmptyState text="No projects have been created yet." />
      )}
    </div>
  )
}

function ProjectsTable({ projects }: { projects: Project[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>
              <Link
                className="hover:underline"
                to={generatePath(ROUTES.PROJECT, {
                  projectId: project.id,
                })}>
                {project.name}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
