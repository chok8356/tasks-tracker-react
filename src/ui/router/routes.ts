import { useParams } from 'react-router-dom'

const HOME = '/'
const LOGIN = '/login'
const USER = '/user'

const PROJECTS = '/projects'
const PROJECTS_CREATE = `${PROJECTS}/create`

const PROJECT = `${PROJECTS}/:projectId`

const PROJECT_BACKLOG = `${PROJECT}/backlog`

const PROJECT_ISSUES = `${PROJECT}/issues`
const PROJECT_ISSUES_CREATE = `${PROJECT_ISSUES}/create`
const PROJECT_ISSUES_ISSUE = `${PROJECT_ISSUES}/:issueId`

const PROJECT_SETTINGS = `${PROJECT}/settings`

const PROJECT_SETTINGS_ISSUE_STATUSES = `${PROJECT_SETTINGS}/issue-statuses`
const PROJECT_SETTINGS_ISSUE_STATUSES_CREATE = `${PROJECT_SETTINGS_ISSUE_STATUSES}/create`
const PROJECT_SETTINGS_ISSUE_STATUSES_EDIT = `${PROJECT_SETTINGS_ISSUE_STATUSES}/:statusId`

const PROJECT_SETTINGS_ISSUE_TYPES = `${PROJECT_SETTINGS}/issue-types`
const PROJECT_SETTINGS_ISSUE_TYPES_CREATE = `${PROJECT_SETTINGS_ISSUE_TYPES}/create`
const PROJECT_SETTINGS_ISSUE_TYPES_EDIT = `${PROJECT_SETTINGS_ISSUE_TYPES}/:typeId`

const PROJECT_SETTINGS_MEMBERS = `${PROJECT_SETTINGS}/members`
const PROJECT_SETTINGS_MEMBERS_CREATE = `${PROJECT_SETTINGS_MEMBERS}/create`

export const ROUTES = {
  HOME,
  LOGIN,
  PROJECT,
  PROJECT_BACKLOG,
  PROJECT_ISSUES_CREATE,
  PROJECT_ISSUES_ISSUE,
  PROJECT_SETTINGS_ISSUE_STATUSES,
  PROJECT_SETTINGS_ISSUE_STATUSES_CREATE,
  PROJECT_SETTINGS_ISSUE_STATUSES_EDIT,
  PROJECT_SETTINGS_ISSUE_TYPES,
  PROJECT_SETTINGS_ISSUE_TYPES_CREATE,
  PROJECT_SETTINGS_ISSUE_TYPES_EDIT,
  PROJECT_SETTINGS_MEMBERS,
  PROJECT_SETTINGS_MEMBERS_CREATE,
  PROJECTS,
  PROJECTS_CREATE,
  USER,
} as const

export type PathParams = { [P in RoutePath]: ParamsOf<P> }
type ParamNames<S extends string> = S extends `${string}:${infer P}/${infer R}`
  ? P | ParamNames<`/${R}`>
  : S extends `${string}:${infer P}`
    ? P
    : never

type ParamsOf<S extends string> = [ParamNames<S>] extends [never]
  ? object
  : Record<ParamNames<S>, string>
type RouteKey = keyof typeof ROUTES

type RoutePath = (typeof ROUTES)[RouteKey]

export function useParamsFor<P extends RoutePath>(
  pattern: P,
): Readonly<ParamsOf<P>> {
  void pattern
  return useParams() as Readonly<ParamsOf<P>>
}

declare module 'react-router-dom' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    params: PathParams
  }
}
