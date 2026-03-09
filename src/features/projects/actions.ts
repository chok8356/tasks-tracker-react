import type { Project } from '@/domain/types.ts'
import type { AsyncResult, InfraError } from '@/shared/result.ts'

export type CreateProject = (
  input: CreateProjectInput,
) => AsyncResult<Project, InfraError>

export type CreateProjectInput = Pick<Project, 'description' | 'key' | 'name'>

export type DeleteProject = (id: Project['id']) => AsyncResult<void, InfraError>

export type GetProject = (id: Project['id']) => AsyncResult<Project, InfraError>

export type GetProjects = () => AsyncResult<Project[], InfraError>

export type UpdateProject = (
  input: Partial<Omit<Project, 'id'>> & Pick<Project, 'id'>,
) => AsyncResult<Project, InfraError>
