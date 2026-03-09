import { createHashRouter, redirect } from 'react-router-dom'

import { ROUTES } from '@/ui/router/routes'

export const router = createHashRouter([
  {
    children: [
      {
        children: [
          {
            lazy: () =>
              import('@/ui/pages/app/projects/projects-page.lazy.tsx').then(
                (m) => m.projectsLazyLoader(),
              ),
            path: ROUTES.PROJECTS,
          },
          {
            lazy: () =>
              import('@/ui/pages/app/create-project/create-project-page.lazy.tsx').then(
                (m) => m.createProjectLazyLoader(),
              ),
            path: ROUTES.PROJECTS_CREATE,
          },
          {
            children: [
              {
                lazy: () =>
                  import('@/ui/pages/app/project-details/children/project-board/project-board-page.lazy.tsx').then(
                    (m) => m.projectBoardLazyLoader(),
                  ),
                path: ROUTES.PROJECT,
              },
              {
                lazy: () =>
                  import('@/ui/pages/app/project-details/children/create-issue/create-issue-page.lazy.tsx').then(
                    (m) => m.createIssueLazyLoader(),
                  ),
                path: ROUTES.PROJECT_ISSUES_CREATE,
              },
              {
                lazy: () =>
                  import('@/ui/pages/app/project-details/children/issue-details/issue-details-page.lazy.tsx').then(
                    (m) => m.issueDetailsLazyLoader(),
                  ),
                path: ROUTES.PROJECT_ISSUES_ISSUE,
              },
              {
                lazy: () =>
                  import('@/ui/pages/app/project-details/children/project-backlog/project-backlog-page.lazy.tsx').then(
                    (m) => m.projectBacklogLazyLoader(),
                  ),
                path: ROUTES.PROJECT_BACKLOG,
              },
              {
                children: [
                  {
                    lazy: () =>
                      import('@/ui/pages/app/project-details/children/project-settings/children/issue-types/issue-types-page.lazy.tsx').then(
                        (m) => m.issueTypesLazyLoader(),
                      ),
                    path: ROUTES.PROJECT_SETTINGS_ISSUE_TYPES,
                  },
                  {
                    lazy: () =>
                      import('@/ui/pages/app/project-details/children/project-settings/children/create-issue-type/create-issue-type-page.lazy.tsx').then(
                        (m) => m.createIssueTypeLazyLoader(),
                      ),
                    path: ROUTES.PROJECT_SETTINGS_ISSUE_TYPES_CREATE,
                  },
                  {
                    lazy: () =>
                      import('@/ui/pages/app/project-details/children/project-settings/children/edit-issue-type/edit-issue-type-page.lazy.tsx').then(
                        (m) => m.editIssueTypeLazyLoader(),
                      ),
                    path: ROUTES.PROJECT_SETTINGS_ISSUE_TYPES_EDIT,
                  },
                  {
                    lazy: () =>
                      import('@/ui/pages/app/project-details/children/project-settings/children/issue-statuses/issue-statuses-page.lazy.tsx').then(
                        (m) => m.issueStatusesLazyLoader(),
                      ),
                    path: ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES,
                  },
                  {
                    lazy: () =>
                      import('@/ui/pages/app/project-details/children/project-settings/children/create-issue-status/create-issue-status-page.lazy.tsx').then(
                        (m) => m.createIssueStatusLazyLoader(),
                      ),
                    path: ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_CREATE,
                  },
                  {
                    lazy: () =>
                      import('@/ui/pages/app/project-details/children/project-settings/children/edit-issue-status/edit-issue-status-page.lazy.tsx').then(
                        (m) => m.editIssueStatusLazyLoader(),
                      ),
                    path: ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_EDIT,
                  },
                  {
                    lazy: () =>
                      import('@/ui/pages/app/project-details/children/project-settings/children/project-members/project-members-page.lazy.tsx').then(
                        (m) => m.projectMembersLazyLoader(),
                      ),
                    path: ROUTES.PROJECT_SETTINGS_MEMBERS,
                  },
                  {
                    lazy: () =>
                      import('@/ui/pages/app/project-details/children/project-settings/children/create-project-member/create-project-member-page.lazy.tsx').then(
                        (m) => m.createProjectMemberLazyLoader(),
                      ),
                    path: ROUTES.PROJECT_SETTINGS_MEMBERS_CREATE,
                  },
                ],
                lazy: () =>
                  import('@/ui/pages/app/project-details/children/project-settings/project-settings-page.lazy.tsx').then(
                    (m) => m.projectSettingsLazyLoader(),
                  ),
              },
            ],
            lazy: () =>
              import('@/ui/pages/app/project-details/project-details-page.lazy.tsx').then(
                (m) => m.projectDetailsLazyLoader(),
              ),
          },
          {
            lazy: () =>
              import('@/ui/pages/app/user/user-page.lazy.tsx').then((m) =>
                m.userLazyLoader(),
              ),
            path: ROUTES.USER,
          },
        ],
        lazy: () =>
          import('@/ui/layouts/app-layout.lazy.tsx').then((m) =>
            m.appLayoutLazyLoader(),
          ),
      },
    ],
    lazy: async () => {
      const [{ protectedLoader, ProtectedRoute }] = await Promise.all([
        import('@/ui/router/protected-route'),
      ])
      return {
        Component: ProtectedRoute,
        loader: protectedLoader,
      }
    },
  },
  {
    lazy: () =>
      import('@/ui/pages/login-page.lazy.tsx').then((m) => m.loginLazyLoader()),
    path: ROUTES.LOGIN,
  },
  {
    loader: () => redirect(ROUTES.PROJECTS),
    path: ROUTES.HOME,
  },
  {
    lazy: () =>
      import('@/ui/pages/not-found-page.lazy.tsx').then((m) =>
        m.notFoundLazyLoader(),
      ),
    path: '*',
  },
])
