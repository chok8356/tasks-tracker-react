import { SquareTerminal } from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {
  navMain: [
    {
      icon: SquareTerminal,
      title: 'Board',
      url: '/board',
    },
  ],
  user: {
    avatar: '/avatars/shadcn.jpg',
    email: 'm@example.com',
    name: 'shadcn',
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
