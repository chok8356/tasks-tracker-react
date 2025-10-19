import type {
  IssueDTO,
  IssueStatusDTO,
  IssueTypeDTO,
  ProjectDTO,
} from '@/infra/api/api-types.ts'

import { dbPromise } from '@/infra/api/storage/db.ts'

export async function seedIssues(data: {
  projects: ProjectDTO[]
  statuses: IssueStatusDTO[]
  types: IssueTypeDTO[]
}): Promise<void> {
  const db = await dbPromise
  const now = new Date().toISOString()

  const allMemberships = await db.getAll('project_memberships')
  const issues: IssueDTO[] = []

  data.projects.forEach((project, projectIndex) => {
    const projectMemberships = allMemberships.filter(
      (m) => m.project_id === project.id,
    )
    const projectStatuses = data.statuses.filter(
      (s) => s.project_id === project.id,
    )
    const projectTypes = data.types.filter((t) => t.project_id === project.id)

    for (let i = 1; i <= 20; i++) {
      const reporterMembership =
        projectMemberships[
          Math.floor(Math.random() * projectMemberships.length)
        ]
      const assigneeMembership =
        Math.random() > 0.3
          ? projectMemberships[
              Math.floor(Math.random() * projectMemberships.length)
            ]
          : null

      issues.push({
        assignee_id: assigneeMembership ? assigneeMembership.id : null,
        created_at: now,
        description: `This is a detailed description for issue ${i} in project ${project.key}.`,
        estimate: Math.floor(Math.random() * 15) + 1,
        id: `${project.key}-${i}`,
        is_on_board: Math.random() > 0.5,
        order: projectIndex * 20 + i - 1,
        project_id: project.id,
        reporter_id: reporterMembership.id,
        status_id:
          projectStatuses[Math.floor(Math.random() * projectStatuses.length)]
            .id,
        summary: `Summary for issue ${i} in ${project.key}`,
        type_id:
          projectTypes[Math.floor(Math.random() * projectTypes.length)].id,
        updated_at: now,
      })
    }
  })

  for (const issue of issues) {
    await db.add('issues', issue)
  }

  console.info(`Seeded ${issues.length} issues`)
}
