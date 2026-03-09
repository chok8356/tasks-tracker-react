import type { User } from '@/domain/types.ts'
import type { AsyncResult, InfraError } from '@/shared/result.ts'

export type GetCurrentUser = () => AsyncResult<User, InfraError>

export type UpdateUser = (
  input: Partial<Omit<User, 'email' | 'id'>>,
) => AsyncResult<User, InfraError>
