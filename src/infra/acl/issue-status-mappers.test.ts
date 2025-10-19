import { describe, expect, it } from 'vitest'

import type { IssueStatus } from '@/domain/types'
import type { IssueStatusDTO } from '@/infra/api/api-types'

import { mapIssueStatusDtoToDomain } from './issue-status-mappers'

describe('issue-status-mappers', () => {
  it('should map IssueStatusDTO to IssueStatus domain object', () => {
    const issueStatusDto: IssueStatusDTO = {
      category: 'todo',
      created_at: '2023-01-01T10:00:00.000Z',
      id: 'status-1',
      name: 'To Do',
      order: 1,
      project_id: 'project-1',
      updated_at: '2023-01-01T11:00:00.000Z',
    }

    const expectedIssueStatus: IssueStatus = {
      category: 'todo',
      id: 'status-1',
      name: 'To Do',
      order: 1,
      projectId: 'project-1',
    }

    expect(mapIssueStatusDtoToDomain(issueStatusDto)).toEqual(
      expectedIssueStatus,
    )
  })
})
