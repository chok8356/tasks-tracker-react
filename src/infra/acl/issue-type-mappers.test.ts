import { describe, expect, it } from 'vitest'

import type { IssueType } from '@/domain/types'
import type { IssueTypeDTO } from '@/infra/api/api-types'

import { mapIssueTypeDtoToDomain } from './issue-type-mappers'

describe('issue-type-mappers', () => {
  it('should map IssueTypeDTO to IssueType domain object with valid color and icon', () => {
    const issueTypeDto: IssueTypeDTO = {
      color: 'blue',
      created_at: '2023-01-01T10:00:00.000Z',
      icon: 'Bug',
      id: 'type-1',
      name: 'Bug',
      order: 1,
      project_id: 'project-1',
      updated_at: '2023-01-01T11:00:00.000Z',
    }

    const expectedIssueType: IssueType = {
      color: 'blue',
      icon: 'Bug',
      id: 'type-1',
      name: 'Bug',
      order: 1,
      projectId: 'project-1',
    }

    expect(mapIssueTypeDtoToDomain(issueTypeDto)).toEqual(expectedIssueType)
  })

  it('should map IssueTypeDTO to IssueType domain object with invalid color and icon, using defaults', () => {
    const issueTypeDto: IssueTypeDTO = {
      color: 'invalid-color',
      created_at: '2023-01-01T10:00:00.000Z',
      icon: 'invalid-icon',
      id: 'type-2',
      name: 'Task',
      order: 2,
      project_id: 'project-1',
      updated_at: '2023-01-01T11:00:00.000Z',
    }

    const expectedIssueType: IssueType = {
      color: 'blue',
      icon: 'Bug',
      id: 'type-2',
      name: 'Task',
      order: 2,
      projectId: 'project-1',
    }

    expect(mapIssueTypeDtoToDomain(issueTypeDto)).toEqual(expectedIssueType)
  })
})
