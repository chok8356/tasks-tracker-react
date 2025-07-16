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
  const [clonedColumns, setClonedColumns] = useState<Columns>(() =>
    structuredClone(columns),
  )
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const findContainer = (id: number) =>
    clonedColumns.find((col) => col.cards.some((card) => card.id === id))

  const getCardIndex = (col: Column, id: number) =>
    col.cards.findIndex((c) => c.id === id)

  const handleDragStart = ({ active }: DragStartEvent) => {
    const id = active.id as number
    const col = findContainer(id)
    const card = col?.cards.find((c) => c.id === id) ?? null
    setActiveCard(card)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!active || !over) return

    const activeId = active.id as number
    const overId = over.id as number
    if (activeId === overId) return

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) return

    if (activeContainer.id !== overContainer.id) {
      setClonedColumns((prev) => {
        const next = prev
        const sourceColIndex = next.findIndex(
          (col) => col.id === activeContainer.id,
        )
        const targetColIndex = next.findIndex(
          (col) => col.id === overContainer.id,
        )
        const sourceCardIndex = getCardIndex(next[sourceColIndex], activeId)
        const overCardIndex = getCardIndex(next[targetColIndex], overId)

        const [movedCard] = next[sourceColIndex].cards.splice(
          sourceCardIndex,
          1,
        )
        next[targetColIndex].cards.splice(overCardIndex, 0, movedCard)
        return next
      })
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      setActiveCard(null)
      return
    }

    const activeId = active.id as number
    const overId = over.id as number
    if (activeId === overId) {
      setActiveCard(null)
      return
    }

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) {
      setActiveCard(null)
      return
    }

    setClonedColumns((prev) => {
      const next = structuredClone(prev)
      const sourceColIndex = next.findIndex(
        (col) => col.id === activeContainer.id,
      )
      const targetColIndex = next.findIndex(
        (col) => col.id === overContainer.id,
      )
      const sourceCardIndex = getCardIndex(next[sourceColIndex], activeId)
      const overCardIndex = getCardIndex(next[targetColIndex], overId)

      const [movedCard] = next[sourceColIndex].cards.splice(sourceCardIndex, 1)
      let insertIndex = overCardIndex
      if (
        activeContainer.id === overContainer.id &&
        sourceCardIndex < overCardIndex
      ) {
        insertIndex -= 1
      }
      next[targetColIndex].cards.splice(insertIndex, 0, movedCard)

      onColumnsChange(next)
      return next
    })

    setActiveCard(null)
  }

  const handleDragCancel = () => {
    setActiveCard(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={rectIntersection}>
      <div className="flex h-full gap-2">
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
