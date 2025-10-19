import type { Project } from '@/domain/types.ts'

export type GetProjectUseCase = (id: Project['id']) => Promise<Project>
