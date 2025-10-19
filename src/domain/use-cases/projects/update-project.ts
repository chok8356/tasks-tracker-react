import type { Project } from '@/domain/types.ts'

export type UpdateProjectUseCase = (
  req: Partial<Omit<Project, 'id'>> & Pick<Project, 'id'>,
) => Promise<Project>
