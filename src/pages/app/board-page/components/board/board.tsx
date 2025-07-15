import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'

import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'
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
  // Используем PointerSensor для лучшей совместимости с разными устройствами
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Требуем, чтобы пользователь передвинул курсор на 9px, прежде чем начнется перетаскивание
        distance: 9,
      },
    }),
  )
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const findColumnForCard = (
    cardId: number,
    currentColumns: Columns,
  ): Column | undefined => {
    return currentColumns.find((col) => col.cards.some((c) => c.id === cardId))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = event.active.id as number
    const col = findColumnForCard(cardId, columns)
    const card = col?.cards.find((c) => c.id === cardId)
    if (card) setActiveCard(card)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as number
    const overId = over.id as number

    if (activeId === overId) return

    const activeColumn = findColumnForCard(activeId, columns)
    // Элемент, над которым мы находимся, может быть как колонкой, так и другой карточкой
    const overColumn =
      columns.find((c) => c.id === overId) || findColumnForCard(overId, columns)

    // *** КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ ***
    // Вызываем обновление состояния, только если карточка переместилась в ДРУГУЮ колонку.
    // Это предотвращает бесконечный цикл обновлений.
    if (activeColumn && overColumn && activeColumn.id !== overColumn.id) {
      onColumnsChange((currentColumns) => {
        const activeItems =
          currentColumns.find((c) => c.id === activeColumn.id)?.cards || []
        const overItems =
          currentColumns.find((c) => c.id === overColumn.id)?.cards || []

        const activeIndex = activeItems.findIndex((c) => c.id === activeId)
        const overIndex = overItems.findIndex((c) => c.id === overId)

        const movingCard = activeItems[activeIndex]
        if (!movingCard) return currentColumns

        // Определяем новую позицию в колонке
        const newIndex = overIndex >= 0 ? overIndex : overItems.length

        return currentColumns.map((col) => {
          // Удаляем карточку из старой колонки
          if (col.id === activeColumn.id) {
            return {
              ...col,
              cards: col.cards.filter((c) => c.id !== activeId),
            }
          }
          // Добавляем карточку в новую колонку
          if (col.id === overColumn.id) {
            const newCards = [...col.cards]
            newCards.splice(newIndex, 0, movingCard)
            return { ...col, cards: newCards }
          }
          return col
        })
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null)
    const { active, over } = event
    if (!over) return

    const activeId = Number(active.id)
    const overId = Number(over.id)

    const activeColumn = findColumnForCard(activeId, columns)
    const overColumn = findColumnForCard(overId, columns)

    // Обрабатываем только сортировку внутри ОДНОЙ колонки.
    // Перемещение между колонками уже обработано в onDragOver.
    if (
      activeColumn &&
      overColumn &&
      activeColumn.id === overColumn.id &&
      activeId !== overId
    ) {
      const fromIndex = activeColumn.cards.findIndex((c) => c.id === activeId)
      const toIndex = overColumn.cards.findIndex((c) => c.id === overId)

      if (fromIndex !== toIndex) {
        onColumnsChange((currentColumns) => {
          return currentColumns.map((col) => {
            if (col.id === activeColumn.id) {
              return {
                ...col,
                cards: arrayMove(col.cards, fromIndex, toIndex),
              }
            }
            return col
          })
        })
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}>
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
