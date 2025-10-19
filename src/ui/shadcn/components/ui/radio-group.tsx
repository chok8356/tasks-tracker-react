import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/ui/shadcn/lib/utils'

const RadioGroup = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
  ref?: React.RefObject<null | React.ElementRef<
    typeof RadioGroupPrimitive.Root
  >>
}) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  )
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
  ref?: React.RefObject<null | React.ElementRef<
    typeof RadioGroupPrimitive.Item
  >>
}) => {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'border-primary text-primary focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border shadow focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}>
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="fill-primary h-3.5 w-3.5" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
