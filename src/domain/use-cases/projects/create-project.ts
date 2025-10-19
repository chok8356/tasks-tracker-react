import type { Project } from '@/domain/types.ts'

export type CreateProjectUseCase = (
  req: Pick<Project, 'description' | 'key' | 'name'>,
) => Promise<Project>
