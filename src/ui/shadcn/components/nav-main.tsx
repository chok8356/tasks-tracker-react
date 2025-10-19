import type { LucideIcon } from 'lucide-react'
import type * as React from 'react'

import { useLocation } from 'react-router-dom'

import {
  Collapsible,
  CollapsibleTrigger,
} from '@/ui/shadcn/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/ui/shadcn/components/ui/sidebar'
import { cn } from '@/ui/shadcn/lib/utils.ts'

type NavMainItem = {
  element?: React.ElementType
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    element?: React.ElementType
    title: string
    url: string
  }[]
  title: string
  url?: string
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const ItemElement = item.element ?? 'a'
          const itemLinkProps =
            ItemElement === 'a' ? { href: item.url } : { to: item.url }

          const buttonContent = (
            <>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </>
          )

          return (
            <Collapsible
              asChild
              className="group/collapsible"
              defaultOpen={item.isActive}
              key={item.title}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  {item.url ? (
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        pathname.startsWith(item.url) && 'bg-muted',
                      )}
                      tooltip={item.title}>
                      <ItemElement
                        {...itemLinkProps}
                        onClick={handleLinkClick}>
                        {buttonContent}
                      </ItemElement>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton tooltip={item.title}>
                      {buttonContent}
                    </SidebarMenuButton>
                  )}
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
