import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { Check, ChevronRight, Circle } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/ui/shadcn/lib/utils'

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return (
    <MenubarPrimitive.Sub
      data-slot="menubar-sub"
      {...props}
    />
  )
}

const Menubar = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> & {
  ref?: React.RefObject<null | React.ElementRef<typeof MenubarPrimitive.Root>>
}) => (
  <MenubarPrimitive.Root
    className={cn(
      'bg-background flex h-9 items-center space-x-1 rounded-md border p-1 shadow-sm',
      className,
    )}
    ref={ref}
    {...props}
  />
)
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> & {
  ref?: React.RefObject<null | React.ElementRef<
    typeof MenubarPrimitive.Trigger
  >>
}) => (
  <MenubarPrimitive.Trigger
    className={cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-3 py-1 text-sm font-medium outline-none select-none',
      className,
    )}
    ref={ref}
    {...props}
  />
)
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = ({
  children,
  className,
  inset,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
} & {
  ref?: React.RefObject<null | React.ElementRef<
    typeof MenubarPrimitive.SubTrigger
  >>
}) => (
  <MenubarPrimitive.SubTrigger
    className={cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
      inset && 'pl-8',
      className,
    )}
    ref={ref}
    {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
)
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> & {
  ref?: React.RefObject<null | React.ElementRef<
    typeof MenubarPrimitive.SubContent
  >>
}) => (
  <MenubarPrimitive.SubContent
    className={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-[--radix-menubar-content-transform-origin] overflow-hidden rounded-md border p-1 shadow-lg',
      className,
    )}
    ref={ref}
    {...props}
  />
)
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = ({
  align = 'start',
  alignOffset = -4,
  className,
  ref,
  sideOffset = 8,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> & {
  ref?: React.RefObject<null | React.ElementRef<
    typeof MenubarPrimitive.Content
  >>
}) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      align={align}
      alignOffset={alignOffset}
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-[--radix-menubar-content-transform-origin] overflow-hidden rounded-md border p-1 shadow-md',
        className,
      )}
      ref={ref}
      sideOffset={sideOffset}
      {...props}
    />
  </MenubarPrimitive.Portal>
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = ({
  className,
  inset,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
  inset?: boolean
} & {
  ref?: React.RefObject<null | React.ElementRef<typeof MenubarPrimitive.Item>>
}) => (
  <MenubarPrimitive.Item
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className,
    )}
    ref={ref}
    {...props}
  />
)
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = ({
  checked,
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> & {
  ref?: React.RefObject<null | React.ElementRef<
    typeof MenubarPrimitive.CheckboxItem
  >>
}) => (
  <MenubarPrimitive.CheckboxItem
    checked={checked}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    ref={ref}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
)
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = ({
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> & {
  ref?: React.RefObject<null | React.ElementRef<
    typeof MenubarPrimitive.RadioItem
  >>
}) => (
  <MenubarPrimitive.RadioItem
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    ref={ref}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
)
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = ({
  className,
  inset,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
  inset?: boolean
} & {
  ref?: React.RefObject<null | React.ElementRef<typeof MenubarPrimitive.Label>>
}) => (
  <MenubarPrimitive.Label
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
    ref={ref}
    {...props}
  />
)
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator> & {
  ref?: React.RefObject<null | React.ElementRef<
    typeof MenubarPrimitive.Separator
  >>
}) => (
  <MenubarPrimitive.Separator
    className={cn('bg-muted -mx-1 my-1 h-px', className)}
    ref={ref}
    {...props}
  />
)
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className,
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = 'MenubarShortcut'

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
