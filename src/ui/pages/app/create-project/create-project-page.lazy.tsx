import { createProject } from '@/infra/projects/create-project'
import { CreateProjectPage } from '@/ui/pages/app/create-project/create-project-page.tsx'

export const createProjectLazyLoader = async () => {
  return {
    Component: () => (
      <CreateProjectPage
        deps={{
          createProject,
        }}
      />
    ),
  }
}
