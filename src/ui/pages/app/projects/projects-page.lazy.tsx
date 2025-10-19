export const projectsLazyLoader = async () => {
  const [{ ProjectsPage }, { getProjectsUseCase }] = await Promise.all([
    import('@/ui/pages/app/projects/projects-page.tsx'),
    import('@/app/use-cases/projects/get-projects'),
  ])
  return {
    Component: () => (
      <ProjectsPage
        useCases={{
          getProjectsUseCase,
        }}
      />
    ),
  }
}
