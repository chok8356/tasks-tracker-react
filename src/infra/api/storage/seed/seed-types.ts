import { nanoid } from 'nanoid'

import type { IssueTypeDTO, ProjectDTO } from '@/infra/api/api-types.ts'

import { dbPromise } from '@/infra/api/storage/db.ts'

export async function seedTypes(
  projects: ProjectDTO[],
): Promise<IssueTypeDTO[]> {
  const db = await dbPromise
  const now = new Date().toISOString()
  const [firstProject, secondProject] = projects

  if (!firstProject || !secondProject) {
    throw new Error('Expected at least two projects to seed issue types')
  }

  const projectTypes: IssueTypeDTO[] = [
    {
      color: 'red',
      created_at: now,
      icon: 'Bug',
      id: nanoid(),
      name: 'Bug',
      order: 0,
      project_id: firstProject.id,
      updated_at: now,
    },
    {
      color: 'blue',
      created_at: now,
      icon: 'CheckSquare',
      id: nanoid(),
      name: 'Feature',
      order: 1,
      project_id: firstProject.id,
      updated_at: now,
    },
    {
      color: 'yellow',
      created_at: now,
      icon: 'Book',
      id: nanoid(),
      name: 'Research',
      order: 2,
      project_id: firstProject.id,
      updated_at: now,
    },

    {
      color: 'red',
      created_at: now,
      icon: 'Bug',
      id: nanoid(),
      name: 'Bug',
      order: 0,
      project_id: secondProject.id,
      updated_at: now,
    },
    {
      color: 'blue',
      created_at: now,
      icon: 'CheckSquare',
      id: nanoid(),
      name: 'Feature',
      order: 1,
      project_id: secondProject.id,
      updated_at: now,
    },
    {
      color: 'indigo',
      created_at: now,
      icon: 'Bookmark',
      id: nanoid(),
      name: 'Epic',
      order: 2,
      project_id: secondProject.id,
      updated_at: now,
    },
  ]

  for (const type of projectTypes) {
    await db.add('project_types', type)
  }

  console.info(`Seeded ${projectTypes.length} project types`)

  return projectTypes
}
