import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { QueryProvider } from '@/app/providers/query-provider'
import { runSeed } from '@/infra/api/storage/seed'
import { Toaster } from '@/ui/shadcn/components/ui/sonner'

import { router } from './ui/router/router'
import './index.css'

runSeed().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </QueryProvider>
    </React.StrictMode>,
  )
})
