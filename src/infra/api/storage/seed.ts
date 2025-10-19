import { dbPromise } from '@/infra/api/storage/db.ts'

import { seedIssues } from './seed/seed-issues.ts'
import { seedMemberships } from './seed/seed-memberships.ts'
import { seedProjects } from './seed/seed-projects.ts'
import { seedStatuses } from './seed/seed-statuses.ts'
import { seedTypes } from './seed/seed-types.ts'
import { seedUsers } from './seed/seed-users.ts'

export async function runSeed(): Promise<void> {
  try {
    console.info('Starting database seeding...')
    await seedDatabase()
    console.info('Database seeding finished successfully')
  } catch (error) {
    console.error('Database seeding failed:', error)
    throw error
  }
}

export async function seedDatabase(): Promise<void> {
  const hasExistingData = await hasData()

  if (hasExistingData) {
    console.info('Database already contains data. Skipping seeding.')
    return
  }

  console.info('Database is empty. Starting seeding process...')
  await clearDatabase()

  const users = await seedUsers()
  const projects = await seedProjects(users)
  const types = await seedTypes(projects)
  const statuses = await seedStatuses(projects)
  await seedMemberships(projects, users)
  await seedIssues({ projects, statuses, types })

  console.info('Database seeding completed successfully')
}

async function clearDatabase(): Promise<void> {
  const db = await dbPromise

  const stores = [
    'users',
    'projects',
    'project_types',
    'project_statuses',
    'project_memberships',
    'issues',
  ] as const

  for (const storeName of stores) {
    if (db.objectStoreNames.contains(storeName)) {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      await store.clear()
      await transaction.done
    }
  }

  console.info('Database cleared successfully')
}

async function hasData(): Promise<boolean> {
  const db = await dbPromise

  try {
    const transaction = db.transaction(['users', 'projects'], 'readonly')
    const userStore = transaction.objectStore('users')
    const projectStore = transaction.objectStore('projects')

    const userCount = await userStore.count()
    const projectCount = await projectStore.count()

    await transaction.done

    return userCount > 0 || projectCount > 0
  } catch (error) {
    console.warn('Error checking for existing data:', error)
    return false
  }
}
