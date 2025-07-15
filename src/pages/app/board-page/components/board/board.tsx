import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import {
  closestCenter,
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'
import { createPortal } from 'react-dom'

import type { Card } from '@/pages/app/board-page/components/board/components/board-card.tsx'
import type { Column } from '@/pages/app/board-page/components/board/components/board-column.tsx'

import { BoardCard } from '@/pages/app/board-page/components/board/components/board-card.tsx'
import { BoardColumn } from '@/pages/app/board-page/components/board/components/board-column.tsx'

export type Columns = Column[]

export const Board = ({
  columns,
  onColumnsChange,
}: {
  columns: Columns
  onColumnsChange: (updated: Columns) => void
}) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = event.active.id as number
    const col = columns.find((col) => col.cards.some((c) => c.id === cardId))
    const card = col?.cards.find((c) => c.id === cardId)
    if (card) setActiveCard(card)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    if (!over || active.id === over.id) return

    const activeId = Number(active.id)
    const overId = Number(over.id)

    const fromColumn = columns.find((col) =>
      col.cards.some((card) => card.id === activeId),
    )
    const toColumn = columns.find((col) =>
      col.cards.some((card) => card.id === overId),
    )

    if (!fromColumn || !toColumn) return

    const fromIndex = fromColumn.cards.findIndex((c) => c.id === activeId)
    const toIndex = toColumn.cards.findIndex((c) => c.id === overId)
    const movingCard = fromColumn.cards[fromIndex]

    const updatedColumns: Columns = columns.map((col) => {
      if (col.id === fromColumn.id && col.id === toColumn.id) {
        // сортировка внутри одной колонки
        const newCards = [...col.cards]
        const reordered = arrayMove(newCards, fromIndex, toIndex)
        return { ...col, cards: reordered }
      }

      if (col.id === fromColumn.id) {
        return {
          ...col,
          cards: col.cards.filter((c) => c.id !== activeId),
        }
      }

      if (col.id === toColumn.id) {
        const newCards = [...col.cards]
        newCards.splice(toIndex, 0, movingCard)
        return { ...col, cards: newCards }
      }

      return col
    })

    onColumnsChange(updatedColumns)
  }

  return (
    <DndContext
      sensors={sensors}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}>
      <div
        className="grid h-full grid-rows-[1fr] gap-2"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}>
        {/* Колонки */}
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}></BoardColumn>
        ))}
      </div>

      {createPortal(
        <DragOverlay>
          {activeCard ? <BoardCard card={activeCard} /> : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
