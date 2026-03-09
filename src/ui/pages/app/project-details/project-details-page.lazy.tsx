import { getProject } from '@/infra/projects/get-project'
import { ProjectDetailsPage } from '@/ui/pages/app/project-details/project-details-page'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectDetailsLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT)
    return (
      <ProjectDetailsPage
        deps={{
          getProject,
        }}
        projectId={projectId}
      />
    )
  }
  return { Component }
}
