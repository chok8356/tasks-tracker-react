import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@/layouts/AppLayout'
import { DashboardPage } from '@/pages/App/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'

import { ProtectedRoute } from './ProtectedRoute'

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
                to="/dashboard"
                replace
              />
            ),
            path: '/',
          },
          {
            element: <DashboardPage />,
            path: 'dashboard',
          },
        ],
        element: <AppLayout />,
        path: '/',
      },
    ],
    element: <ProtectedRoute />, // Защищённый участок маршрутов
  },
])
