import type { Project, User } from '@/domain/types.ts'

export type RemoveMemberUseCase = (req: {
  projectId: Project['id']
  userId: User['id']
}) => Promise<void>
