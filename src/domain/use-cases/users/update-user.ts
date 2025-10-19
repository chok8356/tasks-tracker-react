import type { User } from '@/domain/types.ts'

export type UpdateUserUseCase = (
  req: Partial<Omit<User, 'email' | 'id'>>,
) => Promise<User>
