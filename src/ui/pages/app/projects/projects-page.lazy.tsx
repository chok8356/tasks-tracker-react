import { getProjects } from '@/infra/projects/get-projects'
import { ProjectsPage } from '@/ui/pages/app/projects/projects-page.tsx'

export const projectsLazyLoader = async () => {
  return {
    Component: () => (
      <ProjectsPage
        deps={{
          getProjects,
        }}
      />
    ),
  }
}
