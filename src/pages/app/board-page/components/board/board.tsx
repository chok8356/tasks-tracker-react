import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useEffect, useRef, useState } from 'react'
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
  const rafId = useRef<number | null>(null)
  const latestDragOverEvent = useRef<DragOverEvent | null>(null)

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const [clonedColumns, setClonedColumns] = useState<Columns>(() =>
    structuredClone(columns),
  )

  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const findColumnByCardId = (id: number) =>
    clonedColumns.find((col) => col.cards.some((card) => card.id === id))

  const getCardIndex = (col: Column, id: number) =>
    col.cards.findIndex((c) => c.id === id)

  const handleDragStart = ({ active }: DragStartEvent) => {
    const id = active.id as number
    const col = findColumnByCardId(id)
    const card = col?.cards.find((c) => c.id === id) ?? null

    setActiveCard(card)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null)

    if (!over) return

    const activeId = active.id as number
    const overId = over.id as number
    if (activeId === overId) return

    onColumnsChange(clonedColumns)
  }

  const handleDragOver = (event: DragOverEvent) => {
    latestDragOverEvent.current = event
    if (rafId.current !== null) return

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      const e = latestDragOverEvent.current
      if (!e) return

      const { active, over } = e
      if (!active || !over) return

      const activeId = active.id as number
      const overId = over.id as number
      if (activeId === overId) return

      const sourceCol = findColumnByCardId(activeId)
      const targetCol =
        clonedColumns.find((col) => col.cards.some((c) => c.id === overId)) ??
        clonedColumns.find((col) => col.id === overId)

      if (!sourceCol || !targetCol) return

      const sourceColIndex = clonedColumns.findIndex(
        (col) => col.id === sourceCol.id,
      )
      const targetColIndex = clonedColumns.findIndex(
        (col) => col.id === targetCol.id,
      )

      const sourceCardIndex = getCardIndex(sourceCol, activeId)
      const overCardIndex = getCardIndex(targetCol, overId)

      const activeCard = sourceCol.cards[sourceCardIndex]
      if (!activeCard) return

      const isSameColumn = sourceCol.id === targetCol.id
      const movingWithinSameColumn =
        isSameColumn &&
        (sourceCardIndex === overCardIndex ||
          sourceCardIndex === overCardIndex - 1)

      if (movingWithinSameColumn) return

      setClonedColumns((prev) => {
        const next = structuredClone(prev)

        const fromCards = next[sourceColIndex].cards
        const toCards = next[targetColIndex].cards

        fromCards.splice(sourceCardIndex, 1)

        let insertIndex: number
        if (toCards.length === 0 || overCardIndex === -1) {
          insertIndex = toCards.length
        } else {
          insertIndex =
            isSameColumn && sourceCardIndex < overCardIndex
              ? overCardIndex - 1
              : overCardIndex
        }

        toCards.splice(insertIndex, 0, activeCard)

        return next
      })
    })
  }

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={rectIntersection}>
      <div
        className="grid h-full grid-rows-[1fr] gap-2"
        style={{
          gridTemplateColumns: `repeat(${clonedColumns.length}, minmax(0, 1fr))`,
        }}>
        {clonedColumns.map((column) => (
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
