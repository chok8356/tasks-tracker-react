import { nanoid } from 'nanoid'

import type { IssueStatusDTO, ProjectDTO } from '@/infra/api/api-types.ts'

import { dbPromise } from '@/infra/api/storage/db.ts'

export async function seedStatuses(
  projects: ProjectDTO[],
): Promise<IssueStatusDTO[]> {
  const db = await dbPromise
  const now = new Date().toISOString()
  const [firstProject, secondProject] = projects

  if (!firstProject || !secondProject) {
    throw new Error('Expected at least two projects to seed statuses')
  }

  const projectStatuses: IssueStatusDTO[] = [
    {
      category: 'todo',
      created_at: now,
      id: nanoid(),
      name: 'To Do',
      order: 0,
      project_id: firstProject.id,
      updated_at: now,
    },
    {
      category: 'in_progress',
      created_at: now,
      id: nanoid(),
      name: 'In Progress',
      order: 1,
      project_id: firstProject.id,
      updated_at: now,
    },
    {
      category: 'in_progress',
      created_at: now,
      id: nanoid(),
      name: 'In Review',
      order: 2,
      project_id: firstProject.id,
      updated_at: now,
    },
    {
      category: 'done',
      created_at: now,
      id: nanoid(),
      name: 'Done',
      order: 3,
      project_id: firstProject.id,
      updated_at: now,
    },

    {
      category: 'todo',
      created_at: now,
      id: nanoid(),
      name: 'Backlog',
      order: 0,
      project_id: secondProject.id,
      updated_at: now,
    },
    {
      category: 'todo',
      created_at: now,
      id: nanoid(),
      name: 'To Do',
      order: 1,
      project_id: secondProject.id,
      updated_at: now,
    },
    {
      category: 'in_progress',
      created_at: now,
      id: nanoid(),
      name: 'In Progress',
      order: 2,
      project_id: secondProject.id,
      updated_at: now,
    },
    {
      category: 'done',
      created_at: now,
      id: nanoid(),
      name: 'Done',
      order: 3,
      project_id: secondProject.id,
      updated_at: now,
    },
  ]

  for (const status of projectStatuses) {
    await db.add('project_statuses', status)
  }

  console.info(`Seeded ${projectStatuses.length} project statuses`)

  return projectStatuses
}
