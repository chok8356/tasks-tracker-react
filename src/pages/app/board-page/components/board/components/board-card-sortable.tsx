import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'

export const BoardCard = (props: {
  id: number
  title: string
  ticketId: string
  estimate: number
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <a
      {...attributes}
      {...listeners}
      style={style}
      ref={setNodeRef}
      key={props.id}
      href="#"
      className="border-border hover:bg-muted grid rounded-xl border bg-white p-3 shadow-xs transition-colors">
      <div className="text-foreground text-sm">{props.title}</div>

      <div className="text-mutedForeground mt-2 flex items-center justify-between gap-2 text-xs">
        <span className="bg-muted rounded-md px-2 py-0.5">
          {props.ticketId}
        </span>

        <span className="bg-muted ml-auto rounded-md px-2 py-0.5">
          {props.estimate}
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
    </a>
  )
}
