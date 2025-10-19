import type { RemoveMemberUseCase } from '@/domain/use-cases/memberships/remove-member'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const removeMemberUseCase: RemoveMemberUseCase = async (req) => {
  await fakeFetch.memberships.remove({ user_id: req.userId })
}
