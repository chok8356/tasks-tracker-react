import { Outlet } from 'react-router-dom'

import type { GetCurrentUser } from '@/features/users/actions.ts'

import { AppSidebar } from '@/ui/shadcn/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
} from '@/ui/shadcn/components/ui/sidebar'

type AppLayoutDeps = {
  getCurrentUser: GetCurrentUser
}

type AppLayoutProps = {
  deps: AppLayoutDeps
}

export function AppLayout({ deps }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar deps={deps} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
