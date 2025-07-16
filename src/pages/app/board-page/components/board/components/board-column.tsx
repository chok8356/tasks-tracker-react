import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import type { Card } from '@/pages/app/board-page/components/board/components/board-card.tsx'

import { BoardCard } from '@/pages/app/board-page/components/board/components/board-card.tsx'

export type Column = {
  id: number
  title: string
  cards: Card[]
}

export const BoardColumn = ({ column }: { column: Column }) => {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      key={column.id}
      className="border-border grid w-75 min-w-75 grid-rows-[auto_1fr] gap-2 rounded-2xl border bg-gray-50 p-2">
      {/* Title */}
      <div className="flex items-center justify-between p-2">
        <span className="text-foreground text-md font-semibold">
          {column.title}
        </span>
        <span className="bg-muted text-mutedForeground rounded-lg px-2 py-0.5 text-sm font-medium">
          {column.cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        <SortableContext
          items={column.cards}
          strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <BoardCard
              key={card.id}
              card={card}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
