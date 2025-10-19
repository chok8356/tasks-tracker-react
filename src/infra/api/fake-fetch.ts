import { useSession } from '@/shared/use-session.ts'

import * as fakeAuthApi from '../../infra/api/fake-api/auth'
import * as fakeIssueStatusesApi from '../../infra/api/fake-api/issue-statuses'
import * as fakeIssueTypesApi from '../../infra/api/fake-api/issue-types'
import * as fakeIssuesApi from '../../infra/api/fake-api/issues'
import * as fakeMembershipsApi from '../../infra/api/fake-api/memberships'
import * as fakeProjectsApi from '../../infra/api/fake-api/projects'
import * as fakeUsersApi from '../../infra/api/fake-api/users'

const originalFakeFetch = {
  auth: { ...fakeAuthApi },
  issues: { ...fakeIssuesApi },
  issueStatuses: { ...fakeIssueStatusesApi },
  issueTypes: { ...fakeIssueTypesApi },
  memberships: { ...fakeMembershipsApi },
  projects: { ...fakeProjectsApi },
  users: { ...fakeUsersApi },
}

export const fakeFetch = createAuthProxy(originalFakeFetch)

function createAuthProxy<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, prop, receiver) {
      if (!Object.isExtensible(target)) {
        return Reflect.get(target, prop, receiver)
      }

      const desc = Reflect.getOwnPropertyDescriptor(target, prop)
      const original = Reflect.get(target, prop, receiver)

      if (desc && desc.configurable === false && desc.writable === false) {
        return original
      }

      if (typeof original === 'object' && original !== null) {
        if (!Object.isExtensible(original)) return original
        return createAuthProxy(original as object as T)
      }

      if (typeof original === 'function') {
        return async (...args: unknown[]) => {
          if (prop === 'login' || prop === 'refresh') {
            return original.apply(target, args)
          }

          const session = useSession.getState()
          if (session.token) {
            try {
              await session.refreshToken(() => originalFakeFetch.auth.refresh())
            } catch (error) {
              console.error('Failed to refresh token, logging out.', error)
              session.logout()
              throw new Error('Session expired. Please log in again.')
            }
            if (!useSession.getState().token) {
              throw new Error('Session expired. Please log in again.')
            }
          }

          return original.apply(target, args)
        }
      }

      return original
    },
  })
}
