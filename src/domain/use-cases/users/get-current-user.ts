import type { User } from '@/domain/types.ts'

export type GetCurrentUserUseCase = () => Promise<User>
