import { createProjectUseCase } from '@/app/use-cases/projects/create-project'
import { CreateProjectPage } from '@/ui/pages/app/create-project/create-project-page.tsx'

export const createProjectLazyLoader = async () => {
  return {
    Component: () => (
      <CreateProjectPage
        useCases={{
          createProjectUseCase,
        }}
      />
    ),
  }
}
