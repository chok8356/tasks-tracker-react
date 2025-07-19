import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import type {
  Cards,
  Column,
} from '@/pages/app/board-page/components/board/types'

import { BoardCard } from './board-card'

export const BoardColumn = ({
  cards,
  column,
}: {
  column: Column
  cards: Cards
}) => {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className="grid w-75 min-w-75 grid-rows-[auto_1fr] gap-2 rounded-xl border bg-gray-50 p-2">
      <div className="flex items-center justify-between p-2">
        <span className="text-md font-semibold">{column.title}</span>
        <span className="bg-muted rounded-lg px-2 py-0.5 text-sm font-medium">
          {column.cards.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <SortableContext
          items={column.cards}
          strategy={verticalListSortingStrategy}>
          {column.cards.map((id) => {
            const card = cards[id]
            return card ? (
              <BoardCard
                key={id}
                card={card}
              />
            ) : null
          })}
        </SortableContext>
      </div>
    </div>
  )
}
