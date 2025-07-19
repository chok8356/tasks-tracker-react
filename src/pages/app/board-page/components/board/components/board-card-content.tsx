import type { CSSProperties, Ref } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { UserIcon } from 'lucide-react'

import type { Card } from '../types'

export const BoardCardContent = ({
  card,
  className,
  ref,
  style,
  ...props
}: {
  card: Card
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLDivElement | null>
}) => {
  return (
    <div
      className={`rounded-xl border bg-white p-3 shadow-xs transition-colors ${className}`}
      style={style}
      ref={ref}
      {...props}>
      <div className="text-foreground text-sm">{card.title}</div>
      <div className="text-muted-foreground mt-2 flex items-center justify-between gap-2 text-xs">
        <span className="bg-muted rounded-md px-2 py-0.5">{card.ticketId}</span>
        <span className="bg-muted ml-auto rounded-md px-2 py-0.5">
          {card.estimate}
        </span>
        <Avatar className="h-6 w-6 rounded-md">
          <AvatarImage />
          <AvatarFallback className="rounded-md">
            <UserIcon
              size={16}
              className="text-gray-400"
            />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
