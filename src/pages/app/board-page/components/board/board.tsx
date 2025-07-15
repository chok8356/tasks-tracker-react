import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'

import {
  closestCorners,
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { createPortal } from 'react-dom'

import type { Card } from './components/board-card'
import type { Column } from './components/board-column'

import { BoardCardContent } from './components/board-card-content'
import { BoardColumn } from './components/board-column'

export type Columns = Column[]

export const Board = ({
  columns,
  onColumnsChange,
}: {
  columns: Columns
  onColumnsChange: (updated: Columns | ((prev: Columns) => Columns)) => void
}) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  const [localColumns, setLocalColumns] = useState<Columns>(() =>
    structuredClone(columns),
  )
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const findColumnByCardId = (id: number) =>
    localColumns.find((col) => col.cards.some((card) => card.id === id))

  const getCardIndex = (col: Column, id: number) =>
    col.cards.findIndex((c) => c.id === id)

  const handleDragStart = ({ active }: DragStartEvent) => {
    const id = active.id as number
    const col = findColumnByCardId(id)
    const card = col?.cards.find((c) => c.id === id) ?? null

    setActiveCard(card)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return

    const activeId = active.id as number
    const overId = over.id as number
    if (activeId === overId) return

    const source = findColumnByCardId(activeId)
    const target = findColumnByCardId(overId)
    if (!source || !target) return

    const activeIndex = getCardIndex(source, activeId)
    const overIndex = getCardIndex(target, overId)
    if (activeIndex === -1 || overIndex === -1) return

    const activeCard = source.cards[activeIndex]
    if (!activeCard) return

    const isBelowOverItem =
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height

    const modifier = isBelowOverItem ? 1 : 0
    const insertIndex = overIndex + modifier

    if (source.id === target.id) {
      const reordered = [...source.cards]
      reordered.splice(activeIndex, 1)
      reordered.splice(
        insertIndex > reordered.length ? reordered.length : insertIndex,
        0,
        activeCard,
      )

      // не обновлять если ничего не поменялось
      const same =
        reordered.length === source.cards.length &&
        reordered.every((c, i) => c.id === source.cards[i].id)
      if (same) return

      setLocalColumns((cols) =>
        cols.map((col) =>
          col.id === source.id ? { ...col, cards: reordered } : col,
        ),
      )
      return
    }

    // === перенос между колонками ===

    const sourceCards = [...source.cards]
    const [moved] = sourceCards.splice(activeIndex, 1)

    const targetCards = [...target.cards]
    if (targetCards.some((c) => c.id === activeId)) return

    targetCards.splice(
      insertIndex > targetCards.length ? targetCards.length : insertIndex,
      0,
      moved,
    )

    setLocalColumns((cols) =>
      cols.map((col) => {
        if (col.id === source.id) {
          return { ...col, cards: sourceCards }
        } else if (col.id === target.id) {
          return { ...col, cards: targetCards }
        } else {
          return col
        }
      }),
    )
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null)

    if (!over) return

    const activeId = active.id as number
    const overId = over.id as number
    if (activeId === overId) return

    onColumnsChange(localColumns)
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
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}>
      <div
        className="grid h-full grid-rows-[1fr] gap-2"
        style={{
          gridTemplateColumns: `repeat(${localColumns.length}, minmax(0, 1fr))`,
        }}>
        {localColumns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
          />
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
