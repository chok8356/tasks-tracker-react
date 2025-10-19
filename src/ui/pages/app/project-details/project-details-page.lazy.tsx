import { getProjectUseCase } from '@/app/use-cases/projects/get-project'
import { ProjectDetailsPage } from '@/ui/pages/app/project-details/project-details-page'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectDetailsLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT)
    return (
      <ProjectDetailsPage
        projectId={projectId}
        useCases={{
          getProjectUseCase,
        }}
      />
    )
  }
  return { Component }
}
