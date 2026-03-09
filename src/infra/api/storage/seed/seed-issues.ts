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

    if (
      projectMemberships.length === 0 ||
      projectStatuses.length === 0 ||
      projectTypes.length === 0
    ) {
      throw new Error(`Project ${project.id} is missing seed dependencies`)
    }

    for (let i = 1; i <= 20; i++) {
      const reporterMembership = pickRandom(
        projectMemberships,
        `Project ${project.id} has no memberships`,
      )
      const assigneeMembership =
        Math.random() > 0.3
          ? pickRandom(
              projectMemberships,
              `Project ${project.id} has no assignee memberships`,
            )
          : null
      const randomStatus = pickRandom(
        projectStatuses,
        `Project ${project.id} has no statuses`,
      )
      const randomType = pickRandom(
        projectTypes,
        `Project ${project.id} has no issue types`,
      )

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
        status_id: randomStatus.id,
        summary: `Summary for issue ${i} in ${project.key}`,
        type_id: randomType.id,
        updated_at: now,
      })
    }
  })

  for (const issue of issues) {
    await db.add('issues', issue)
  }

  console.info(`Seeded ${issues.length} issues`)
}

function pickRandom<T>(items: T[], message: string): T {
  const item = items[Math.floor(Math.random() * items.length)]

  if (!item) {
    throw new Error(message)
  }

  return item
}
