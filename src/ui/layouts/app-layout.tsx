import { Outlet } from 'react-router-dom'

import type { GetCurrentUserUseCase } from '@/domain/use-cases/users/get-current-user'

import { AppSidebar } from '@/ui/shadcn/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
} from '@/ui/shadcn/components/ui/sidebar'

type AppLayoutProps = {
  useCases: AppLayoutUseCases
}

type AppLayoutUseCases = {
  getCurrentUserUseCase: GetCurrentUserUseCase
}

export function AppLayout({ useCases }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar useCases={useCases} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
