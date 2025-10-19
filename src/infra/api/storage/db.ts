import type { DBSchema, IDBPDatabase } from 'idb'

import { openDB } from 'idb'

import type {
  IssueDTO,
  IssueStatusDTO,
  IssueTypeDTO,
  ProjectDTO,
  ProjectMembershipDTO,
  UserDTO,
} from '@/infra/api/api-types.ts'

export type AppDB = IDBPDatabase<AppDBSchema>

type AppDBSchema = DBSchema & {
  issues: {
    key: IssueDTO['id']
    value: IssueDTO
  }
  project_memberships: {
    key: ProjectMembershipDTO['id']
    value: ProjectMembershipDTO
  }
  project_statuses: {
    key: IssueStatusDTO['id']
    value: IssueStatusDTO
  }
  project_types: {
    key: IssueTypeDTO['id']
    value: IssueTypeDTO
  }
  projects: {
    key: ProjectDTO['id']
    value: ProjectDTO
  }
  users: {
    key: UserDTO['id']
    value: UserDTO
  }
}

export const DB_VERSION = 3

export const dbPromise: Promise<AppDB> = openDB<AppDBSchema>(
  'app-db',
  DB_VERSION,
  {
    upgrade(db, oldVersion, newVersion) {
      console.info(`Upgrading DB from version ${oldVersion} to ${newVersion}`)
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('project_types')) {
        db.createObjectStore('project_types', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('project_statuses')) {
        db.createObjectStore('project_statuses', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('project_memberships')) {
        db.createObjectStore('project_memberships', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('issues')) {
        db.createObjectStore('issues', { keyPath: 'id' })
      }
    },
  },
)
