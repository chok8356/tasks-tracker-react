import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { runSeed } from '@/infra/api/storage/seed'
import { QueryProvider } from '@/ui/query-provider'
import { Toaster } from '@/ui/shadcn/components/ui/sonner'

import { router } from './ui/router/router'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

runSeed().then(() => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </QueryProvider>
    </React.StrictMode>,
  )
})
