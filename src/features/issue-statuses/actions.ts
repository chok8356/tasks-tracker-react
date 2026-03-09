import type { IssueStatus, Project } from '@/domain/types.ts'
import type { AsyncResult, InfraError } from '@/shared/result.ts'

export type BulkUpdateIssueStatuses = (input: {
  projectId: Project['id']
  updates: Partial<Pick<IssueStatus, 'id' | 'name' | 'order'>>[]
}) => AsyncResult<IssueStatus[], InfraError>

export type CreateIssueStatus = (
  input: Omit<IssueStatus, 'id' | 'order'>,
) => AsyncResult<IssueStatus, InfraError>

export type DeleteIssueStatus = (
  statusId: IssueStatus['id'],
) => AsyncResult<void, InfraError>

export type GetIssueStatuses = (
  projectId: Project['id'],
) => AsyncResult<IssueStatus[], InfraError>

export type UpdateIssueStatus = (
  input: Partial<Omit<IssueStatus, 'projectId'>> & Pick<IssueStatus, 'id'>,
) => AsyncResult<IssueStatus, InfraError>
