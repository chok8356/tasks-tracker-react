import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '@/ui/shadcn/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  ref?: React.RefObject<null | React.ElementRef<typeof TabsPrimitive.List>>
}) => (
  <TabsPrimitive.List
    className={cn(
      'bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1',
      className,
    )}
    ref={ref}
    {...props}
  />
)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  ref?: React.RefObject<null | React.ElementRef<typeof TabsPrimitive.Trigger>>
}) => (
  <TabsPrimitive.Trigger
    className={cn(
      'ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow',
      className,
    )}
    ref={ref}
    {...props}
  />
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  ref?: React.RefObject<null | React.ElementRef<typeof TabsPrimitive.Content>>
}) => (
  <TabsPrimitive.Content
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      className,
    )}
    ref={ref}
    {...props}
  />
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
