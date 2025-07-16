import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@/layouts/app-layout'
import { BoardPage } from '@/pages/app/board-page/board-page.tsx'
import { MultipleContainers } from '@/pages/app/multiple-containers/multiple-containers.tsx'
import { LoginPage } from '@/pages/login-page'

import { ProtectedRoute } from './protected-route'

export const router = createBrowserRouter([
  {
    element: <LoginPage />,
    path: '/login',
  },
  {
    children: [
      {
        children: [
          {
            element: (
              <Navigate
                to="/board"
                replace
              />
            ),
            index: true,
          },
          {
            element: <BoardPage />,
            path: 'board',
          },
          {
            element: <MultipleContainers />,
            path: 'multiple-containers',
          },
        ],
        element: <AppLayout />,
      },
    ],
    element: <ProtectedRoute />,
    path: '/',
  },
])
