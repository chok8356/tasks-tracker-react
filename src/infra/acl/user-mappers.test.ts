import { describe, expect, it } from 'vitest'

import type { User } from '@/domain/types'
import type { UserDTO } from '@/infra/api/api-types'

import { mapUserDtoToDomain } from './user-mappers'

describe('user-mappers', () => {
  it('should map UserDTO to User domain object', () => {
    const userDto: UserDTO = {
      created_at: '2023-01-01T10:00:00.000Z',
      email: 'test@example.com',
      id: 'user-1',
      name: 'Test User',
      updated_at: '2023-01-01T11:00:00.000Z',
    }

    const expectedUser: User = {
      email: 'test@example.com',
      id: 'user-1',
      name: 'Test User',
    }

    expect(mapUserDtoToDomain(userDto)).toEqual(expectedUser)
  })
})
