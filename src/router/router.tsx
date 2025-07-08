import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@/layouts/app-layout'
import { DashboardPage } from '@/pages/app/dashboard-page'
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
