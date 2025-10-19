import type { Project } from '@/domain/types.ts'

export type DeleteProjectUseCase = (id: Project['id']) => Promise<void>
