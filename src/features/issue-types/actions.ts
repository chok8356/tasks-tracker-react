import type { IssueType, Project } from '@/domain/types.ts'
import type { AsyncResult, InfraError } from '@/shared/result.ts'

export type CreateIssueType = (
  input: Omit<IssueType, 'id' | 'order'>,
) => AsyncResult<IssueType, InfraError>

export type DeleteIssueType = (
  typeId: IssueType['id'],
) => AsyncResult<void, InfraError>

export type GetIssueTypes = (
  projectId: Project['id'],
) => AsyncResult<IssueType[], InfraError>

export type UpdateIssueType = (
  input: Partial<Omit<IssueType, 'id' | 'projectId'>> & Pick<IssueType, 'id'>,
) => AsyncResult<IssueType, InfraError>
