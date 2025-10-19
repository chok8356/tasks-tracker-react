import type { Project } from '@/domain/types.ts'

export type GetProjectsUseCase = () => Promise<Project[]>
