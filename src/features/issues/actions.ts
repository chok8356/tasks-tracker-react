import type { Issue, Project } from '@/domain/types.ts'
import type { AsyncResult, InfraError } from '@/shared/result.ts'

export type BulkUpdateIssues = (input: {
  projectId: Project['id']
  updates: Pick<Issue, 'id' | 'order' | 'statusId'>[]
}) => AsyncResult<Issue[], InfraError>

export type CreateIssue = (
  input: Pick<Issue, 'description' | 'projectId' | 'summary' | 'typeId'>,
) => AsyncResult<Issue, InfraError>

export type DeleteIssue = (
  issueId: Issue['id'],
) => AsyncResult<void, InfraError>

export type GetBacklogIssues = (
  projectId: Project['id'],
) => AsyncResult<Issue[], InfraError>

export type GetBoardIssues = (
  projectId: Project['id'],
) => AsyncResult<Issue[], InfraError>

export type GetIssue = (id: Issue['id']) => AsyncResult<Issue, InfraError>

export type MoveToBacklog = (input: {
  issueId: Issue['id']
  projectId: Project['id']
}) => AsyncResult<Issue, InfraError>

export type MoveToBoard = (input: {
  issueId: Issue['id']
  projectId: Project['id']
}) => AsyncResult<Issue, InfraError>

export type UpdateIssue = (
  input: Partial<Omit<Issue, 'projectId'>> & Pick<Issue, 'id'>,
) => AsyncResult<Issue, InfraError>
