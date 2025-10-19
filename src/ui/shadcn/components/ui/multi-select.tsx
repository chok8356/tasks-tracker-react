import type { ReactNode } from 'react'

import { Checkbox } from '@/ui/shadcn/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/shadcn/components/ui/popover'

export type Option = {
  icon?: ReactNode
  label: string
  value: string
}

type MultiSelectProps = {
  onChange: (value: string[]) => void
  options: Option[]
  trigger: ReactNode
  value: string[]
}

export const MultiSelect = ({
  onChange,
  options,
  trigger,
  value,
}: MultiSelectProps) => {
  const onToggle = (option: Option) => {
    if (value.includes(option.value)) {
      onChange(value.filter((v) => v !== option.value))
    } else {
      onChange([...value, option.value])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto">
        <div className="flex flex-col gap-1">
          {options.length ? (
            options.map((option) => (
              <label
                className="flex cursor-pointer items-center gap-2"
                key={option.value}>
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={() => onToggle(option)}
                />
                {option.label}
              </label>
            ))
          ) : (
            <span className="text-muted-foreground">Empty options</span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
