import type { IssueDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssuesCreateRequest = Pick<
  IssueDTO,
  'description' | 'project_id' | 'summary' | 'type_id'
>
export type IssuesCreateResponse = IssueDTO

export const create = async (
  req: IssuesCreateRequest,
): Promise<IssuesCreateResponse> => {
  const reporterMembershipId = await checkProjectMembership(req.project_id)
  await fakeApiDelay()

  const db = await dbPromise

  const tx = db.transaction(
    ['projects', 'issues', 'project_statuses'],
    'readwrite',
  )
  const projectsStore = tx.objectStore('projects')
  const issuesStore = tx.objectStore('issues')
  const statusesStore = tx.objectStore('project_statuses')

  const project = await projectsStore.get(req.project_id)
  if (!project) {
    throw new Error('Project not found')
  }

  const issueStatuses = await statusesStore.getAll()
  const projectStatuses = issueStatuses
    .filter((s) => s.project_id === req.project_id)
    .sort((a, b) => a.order - b.order)

  if (projectStatuses.length === 0) {
    throw new Error('Project has no issue statuses configured.')
  }
  const defaultStatus = projectStatuses[0]
  if (!defaultStatus) {
    throw new Error('Project has no default issue status configured.')
  }
  const defaultStatusId = defaultStatus.id

  const issues = await issuesStore.getAll()
  const projectIssues = issues.filter((i) => i.project_id === req.project_id)
  const maxOrder = projectIssues.reduce((max, i) => Math.max(max, i.order), 0)

  const projectKey = project.key

  const issueNumbers = projectIssues.map((issue) => {
    const suffix = issue.id.split('-').at(-1)
    const num = Number.parseInt(suffix ?? '0', 10)
    return Number.isNaN(num) ? 0 : num
  })
  const maxIssueNumberFromIssues = Math.max(0, ...issueNumbers)

  const nextIssueNumber =
    Math.max(maxIssueNumberFromIssues, project.last_issue_number) + 1

  const newIssue: IssueDTO = {
    assignee_id: null,
    created_at: new Date().toISOString(),
    description: req.description,
    estimate: null,
    id: `${projectKey}-${nextIssueNumber}`,
    is_on_board: false,
    order: maxOrder + 1,
    project_id: req.project_id,
    reporter_id: reporterMembershipId,
    status_id: defaultStatusId,
    summary: req.summary,
    type_id: req.type_id,
    updated_at: new Date().toISOString(),
  }

  project.last_issue_number = nextIssueNumber
  project.updated_at = new Date().toISOString()

  await issuesStore.add(newIssue)
  await projectsStore.put(project)

  await tx.done

  return newIssue
}
