export type Issue = {
  assigneeId: null | ProjectMembership['id']
  description: null | string
  estimate: null | number
  id: UniqueId
  order: number
  projectId: Project['id']
  reporterId: null | ProjectMembership['id']
  statusId: IssueStatus['id']
  summary: string
  typeId: IssueType['id']
}

export type IssueStatus = {
  category: 'done' | 'in_progress' | 'todo'
  id: UniqueId
  name: string
  order: number
  projectId: Project['id']
}

export type IssueType = {
  color: 'blue' | 'green' | 'indigo' | 'red' | 'yellow'
  icon: 'ArrowUp' | 'Book' | 'Bookmark' | 'Bug' | 'CheckSquare'
  id: UniqueId
  name: string
  order: number
  projectId: Project['id']
}

export type Project = {
  createdAt: Date
  description: string
  id: UniqueId
  key: string
  name: string
  ownerId: User['id']
  updatedAt: Date
}

export type ProjectMembership = {
  id: UniqueId
  projectId: Project['id']
  role: 'admin' | 'member' | 'viewer'
  user: User
}

export type User = {
  email: Email
  id: UniqueId
  name: string
}
