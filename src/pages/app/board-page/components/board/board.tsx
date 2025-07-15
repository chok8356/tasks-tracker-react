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
  getFirstCollision,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Card } from '@/pages/app/board-page/components/board/components/board-card.tsx'
import type { Column } from '@/pages/app/board-page/components/board/components/board-column.tsx'

import { BoardCardContent } from '@/pages/app/board-page/components/board/components/board-card-content'
import { BoardColumn } from '@/pages/app/board-page/components/board/components/board-column.tsx'

export type Columns = Column[]

export const Board = ({
  columns,
  onColumnsChange,
}: {
  columns: Columns
  onColumnsChange: (updated: Columns | ((prev: Columns) => Columns)) => void
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 9,
      },
    }),
  )
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [activeId, setActiveId] = useState<number | null>(null)
  const lastOverId = useRef<number | null>(null)

  const findColumnForCard = (
    cardId: number,
    currentColumns: Columns,
  ): Column | undefined => {
    return currentColumns.find((col) =>
      col.cards.some((card) => card.id === cardId),
    )
  }

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId !== null && columns.some((col) => col.id === activeId)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            columns.some((col) => col.id === container.id),
          ),
        })
      }

      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args)

      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        const overColumn = columns.find((col) => col.id === overId)

        if (overColumn) {
          const columnCards = overColumn.cards.map((card) => card.id)

          if (columnCards.length > 0) {
            const closestCardInColumn = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  columnCards.includes(container.id as number),
              ),
            })[0]?.id

            if (closestCardInColumn) {
              overId = closestCardInColumn
            }
          }
        }

        lastOverId.current = Number(overId)
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, columns],
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const cardId = active.id as number
    setActiveId(cardId)
    const column = findColumnForCard(cardId, columns)
    if (column) {
      setActiveCard(column.cards.find((card) => card.id === cardId) || null)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as number
    const overId = over.id as number

    if (activeId === overId) return

    const activeColumn = findColumnForCard(activeId, columns)
    const overColumn =
      columns.find((c) => c.id === overId) || findColumnForCard(overId, columns)

    if (activeColumn && overColumn && activeColumn.id !== overColumn.id) {
      onColumnsChange((currentColumns) => {
        const newColumns = currentColumns.map((col) => ({
          ...col,
          cards: [...col.cards],
        }))

        const sourceColumnIndex = newColumns.findIndex(
          (col) => col.id === activeColumn.id,
        )
        const destinationColumnIndex = newColumns.findIndex(
          (col) => col.id === overColumn.id,
        )

        if (sourceColumnIndex === -1 || destinationColumnIndex === -1) {
          return currentColumns
        }

        const sourceCards = newColumns[sourceColumnIndex].cards
        const destinationCards = newColumns[destinationColumnIndex].cards

        const activeCardIndex = sourceCards.findIndex(
          (card) => card.id === activeId,
        )
        const [movingCard] = sourceCards.splice(activeCardIndex, 1)

        if (!movingCard) {
          return currentColumns
        }

        let newCardIndexInDestination: number
        if (overId === overColumn.id) {
          newCardIndexInDestination = destinationCards.length
        } else {
          newCardIndexInDestination = destinationCards.findIndex(
            (card) => card.id === overId,
          )
          if (newCardIndexInDestination === -1) {
            newCardIndexInDestination = destinationCards.length
          }
        }

        destinationCards.splice(newCardIndexInDestination, 0, movingCard)

        return newColumns
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    setActiveId(null)
    lastOverId.current = null

    if (!over) return

    const activeId = active.id as number
    const overId = over.id as number

    if (activeId === overId) return

    const activeColumn = findColumnForCard(activeId, columns)
    const overColumn = findColumnForCard(overId, columns)

    if (
      activeColumn &&
      overColumn &&
      activeColumn.id === overColumn.id &&
      activeId !== overId
    ) {
      onColumnsChange((currentColumns) => {
        const targetColumn = currentColumns.find(
          (col) => col.id === activeColumn.id,
        )
        if (!targetColumn) return currentColumns

        const oldIndex = targetColumn.cards.findIndex((c) => c.id === activeId)
        const newIndex = targetColumn.cards.findIndex((c) => c.id === overId)

        if (oldIndex === -1 || newIndex === -1) return currentColumns

        const reorderedCards = arrayMove(targetColumn.cards, oldIndex, newIndex)

        return currentColumns.map((col) =>
          col.id === targetColumn.id ? { ...col, cards: reorderedCards } : col,
        )
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={collisionDetectionStrategy}>
      <div
        className="grid h-full grid-rows-[1fr] gap-2"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}>
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}></BoardColumn>
        ))}
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
