import { describe, expect, it } from 'vitest'

import type { Project } from '@/domain/types'
import type { ProjectDTO } from '@/infra/api/api-types'

import { mapProjectDtoToDomain } from './project-mappers'

describe('project-mappers', () => {
  it('should map ProjectDTO to Project domain object', () => {
    const createdAt = '2023-01-01T10:00:00.000Z'
    const updatedAt = '2023-01-01T11:00:00.000Z'

    const projectDto: ProjectDTO = {
      created_at: createdAt,
      description: 'Project Description',
      id: 'project-1',
      key: 'PRJ',
      last_issue_number: 0,
      name: 'My Project',
      owner_id: 'user-1',
      updated_at: updatedAt,
    }

    const expectedProject: Project = {
      createdAt: new Date(createdAt),
      description: 'Project Description',
      id: 'project-1',
      key: 'PRJ',
      name: 'My Project',
      ownerId: 'user-1',
      updatedAt: new Date(updatedAt),
    }

    expect(mapProjectDtoToDomain(projectDto)).toEqual(expectedProject)
  })

  it('should handle null description in ProjectDTO', () => {
    const createdAt = '2023-01-01T10:00:00.000Z'
    const updatedAt = '2023-01-01T11:00:00.000Z'

    const projectDto: ProjectDTO = {
      created_at: createdAt,
      description: '',
      id: 'project-2',
      key: 'PRJ2',
      last_issue_number: 0,
      name: 'My Project 2',
      owner_id: 'user-2',
      updated_at: updatedAt,
    }

    const expectedProject: Project = {
      createdAt: new Date(createdAt),
      description: '',
      id: 'project-2',
      key: 'PRJ2',
      name: 'My Project 2',
      ownerId: 'user-2',
      updatedAt: new Date(updatedAt),
    }

    expect(mapProjectDtoToDomain(projectDto)).toEqual(expectedProject)
  })
})
