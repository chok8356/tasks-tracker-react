import { describe, expect, it } from 'vitest'

import type { Issue } from '@/domain/types'
import type { IssueDTO } from '@/infra/api/api-types'

import { mapIssueDtoToDomain } from './issue-mappers'

describe('issue-mappers', () => {
  it('should map IssueDTO to Issue domain object', () => {
    const issueDto: IssueDTO = {
      assignee_id: 'assignee-1',
      created_at: '2023-01-01T10:00:00.000Z',
      description: 'Test Description',
      estimate: 10,
      id: 'issue-1',
      is_on_board: true,
      order: 1,
      project_id: 'project-1',
      reporter_id: 'reporter-1',
      status_id: 'status-1',
      summary: 'Test Summary',
      type_id: 'type-1',
      updated_at: '2023-01-01T11:00:00.000Z',
    }

    const expectedIssue: Issue = {
      assigneeId: 'assignee-1',
      description: 'Test Description',
      estimate: 10,
      id: 'issue-1',
      order: 1,
      projectId: 'project-1',
      reporterId: 'reporter-1',
      statusId: 'status-1',
      summary: 'Test Summary',
      typeId: 'type-1',
    }

    expect(mapIssueDtoToDomain(issueDto)).toEqual(expectedIssue)
  })
})
