import type {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core'

import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { createPortal } from 'react-dom'

import type {
  Card,
  Cards,
  Columns,
} from '@/pages/app/board-page/components/board/types'

import { BoardCardContent } from '@/pages/app/board-page/components/board/components/board-card-content.tsx'

import { BoardColumn } from './components/board-column'

export const Board = ({
  cards,
  columns: initialColumnsData,
  onColumnsChange,
}: {
  columns: Columns
  cards: Cards
  onColumnsChange: (updated: Columns) => void
}) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const [columns, setColumns] = useState<Columns>(() =>
    structuredClone(initialColumnsData),
  )

  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const card = cards[active.id as number]
    if (card) {
      setActiveCard(card)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id as number
    const overId = over.id as number

    const activeCol = columns.find((col) => col.cards.includes(activeId))
    const overCol = columns.find(
      (col) => col.cards.includes(overId) || col.id === overId,
    )

    if (!activeCol || !overCol || activeCol.id === overCol.id) return

    setColumns((prev) => {
      return prev.map((col) => {
        if (col.id === activeCol.id) {
          return { ...col, cards: col.cards.filter((id) => id !== activeId) }
        } else if (col.id === overCol.id) {
          const newCards = [...col.cards]
          const insertIndex = newCards.includes(overId)
            ? newCards.indexOf(overId)
            : newCards.length
          newCards.splice(insertIndex, 0, activeId)
          return { ...col, cards: newCards }
        }
        return col
      })
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null)

    const { active, over } = event
    const activeId = active.id as number
    const overId = over?.id as number

    if (!overId || activeId === overId) return

    const sourceCol = columns.find((col) => col.cards.includes(activeId))
    const targetCol = columns.find((col) => col.cards.includes(overId))

    if (!sourceCol || !targetCol) return

    const updated = columns.map((col) => {
      if (col.id === sourceCol.id && sourceCol.id === targetCol.id) {
        const newCards = [...col.cards]
        const oldIndex = newCards.indexOf(activeId)
        const newIndex = newCards.indexOf(overId)

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const [moved] = newCards.splice(oldIndex, 1)
          newCards.splice(newIndex, 0, moved)
        }

        return { ...col, cards: newCards }
      }
      return col
    })

    setColumns(updated)
    onColumnsChange(updated)
  }

  const customCollisionDetection: CollisionDetection = (args) => {
    const { droppableContainers } = args

    const columnIds = columns.map((col) => col.id)

    const columnCollisions = closestCenter({
      ...args,
      droppableContainers: droppableContainers.filter((container) =>
        columnIds.includes(container.id as number),
      ),
    })

    if (!columnCollisions.length) return []

    const closestColId = columnCollisions[0].id

    const targetCardIds =
      columns.find((c) => c.id === closestColId)?.cards ?? []

    const cardCollisions = closestCenter({
      ...args,
      droppableContainers: droppableContainers.filter((container) =>
        targetCardIds.includes(container.id as number),
      ),
    })

    return cardCollisions.length > 0 ? cardCollisions : columnCollisions
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-2">
        {columns.map((column) => {
          return (
            <BoardColumn
              key={column.id}
              column={column}
              cards={cards}
            />
          )
        })}
      </div>
      {createPortal(
        <DragOverlay>
          {activeCard ? <BoardCardContent card={activeCard} /> : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
