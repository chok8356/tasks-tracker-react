'use client'

import { LayoutList, SquareTerminal } from 'lucide-react'
import * as React from 'react'
import { Link } from 'react-router-dom'

import type { GetCurrentUser } from '@/features/users/actions.ts'

import { getInfraErrorMessage } from '@/shared/result.ts'
import { useUserQuery } from '@/ui/query-hooks/users/get-current-user'
import { ROUTES } from '@/ui/router/routes'
import { NavMain } from '@/ui/shadcn/components/nav-main'
import { NavUser } from '@/ui/shadcn/components/nav-user'
import { TeamSwitcher } from '@/ui/shadcn/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/ui/shadcn/components/ui/sidebar'
import { Skeleton } from '@/ui/shadcn/components/ui/skeleton'
import { cn } from '@/ui/shadcn/lib/utils'

type AppSidebarDeps = {
  getCurrentUser: GetCurrentUser
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  deps: AppSidebarDeps
}

export function AppSidebar({ deps, ...props }: AppSidebarProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const { data: userResult, isLoading: isUserLoading } = useUserQuery(
    deps.getCurrentUser,
  )

  const user = userResult?.ok ? userResult.value : null
  const userError = userResult && !userResult.ok ? userResult.error : null

  const navMain = [
    {
      element: Link,
      icon: SquareTerminal,
      isActive: true,
      title: 'Projects',
      url: ROUTES.PROJECTS,
    },
  ]

  return (
    <Sidebar
      collapsible="icon"
      {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={[]} />
        <div
          className={cn(
            'group relative flex h-14 w-full min-w-0 items-center justify-between gap-2 pl-1.5',
            isCollapsed && '',
          )}>
          <LayoutList
            className={cn(
              'size-5',
              isCollapsed && 'block group-hover:hidden',
            )}></LayoutList>

          {!isCollapsed && (
            <b className="ws-nowrap mr-auto text-sm">Tasks Tracker</b>
          )}

          <SidebarTrigger
            className={cn(
              'text-muted-foreground size-5 cursor-pointer',
              isCollapsed && 'hidden group-hover:block',
            )}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        {userError ? (
          <div className="p-4">
            <div className="border-destructive/30 rounded-lg border p-4">
              <p className="text-destructive">
                Error loading user: {getInfraErrorMessage(userError)}
              </p>
            </div>
          </div>
        ) : isUserLoading || !user ? (
          <div
            className="flex items-center gap-2"
            data-testid="user-loading">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ) : (
          <NavUser
            user={{
              avatar: '/avatars/shadcn.jpg',
              email: user.email,
              name: user.name,
            }}
          />
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
