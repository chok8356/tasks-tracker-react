import { describe, expect, it, vi } from 'vitest'

import type { ProjectMembership, User } from '@/domain/types'

import type { ProjectMembershipWithUserDTO } from './membership-mappers'

import { mapMembershipDtoToDomain } from './membership-mappers'
import { mapUserDtoToDomain } from './user-mappers'

vi.mock('./user-mappers', () => ({
  mapUserDtoToDomain: vi.fn(),
}))

describe('membership-mappers', () => {
  it('should map ProjectMembershipWithUserDTO to ProjectMembership domain object', () => {
    const mockUser: User = {
      email: 'test@example.com',
      id: 'user-1',
      name: 'Test User',
    }

    vi.mocked(mapUserDtoToDomain).mockReturnValue(mockUser)

    const membershipDto: ProjectMembershipWithUserDTO = {
      id: 'membership-1',
      joined_at: '2023-01-01T10:00:00.000Z',
      project_id: 'project-1',
      role: 'member',
      user: {
        created_at: '2023-01-01T10:00:00.000Z',
        email: 'test@example.com',
        id: 'user-1',
        name: 'Test User',
        updated_at: '2023-01-01T11:00:00.000Z',
      },
      user_id: 'user-1',
    }

    const expectedMembership: ProjectMembership = {
      id: 'membership-1',
      projectId: 'project-1',
      role: 'member',
      user: mockUser,
    }

    expect(mapMembershipDtoToDomain(membershipDto)).toEqual(expectedMembership)
    expect(mapUserDtoToDomain).toHaveBeenCalledWith(membershipDto.user)
  })
})
