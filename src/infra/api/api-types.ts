export type IssueDTO = {
  assignee_id: null | ProjectMembershipDTO['id']
  created_at: DateTimeString
  description: null | string
  estimate: null | number
  id: UniqueId
  is_on_board: boolean
  order: number
  project_id: ProjectDTO['id']
  reporter_id: null | ProjectMembershipDTO['id']
  status_id: IssueStatusDTO['id']
  summary: string
  type_id: IssueTypeDTO['id']
  updated_at: DateTimeString
}

export type IssueStatusDTO = {
  category: 'done' | 'in_progress' | 'todo'
  created_at: DateTimeString
  id: UniqueId
  name: string
  order: number
  project_id: ProjectDTO['id']
  updated_at: DateTimeString
}

export type IssueTypeDTO = {
  color: string
  created_at: DateTimeString
  icon: string
  id: UniqueId
  name: string
  order: number
  project_id: ProjectDTO['id']
  updated_at: DateTimeString
}

export type ProjectDTO = {
  created_at: DateTimeString
  description: string
  id: UniqueId
  key: string
  last_issue_number: number
  name: string
  owner_id: UserDTO['id']
  updated_at: DateTimeString
}

export type ProjectMembershipDTO = {
  id: UniqueId
  joined_at: DateTimeString
  project_id: ProjectDTO['id']
  role: 'admin' | 'member' | 'viewer'
  user_id: UserDTO['id']
}

export type UserDTO = {
  created_at: DateTimeString
  email: Email
  id: UniqueId
  name: string
  updated_at: DateTimeString
}
