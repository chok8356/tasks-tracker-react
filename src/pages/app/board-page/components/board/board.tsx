import type {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import type { CSSProperties, Ref } from 'react'

import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { UserIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'

export type ColumnsData = {
  id: number
  title: string
  cards: {
    id: number
    title: string
    ticketId: string
    estimate: number
  }[]
}[]

type Column = {
  id: number
  title: string
  cards: Map<number, Card>
}

type Card = {
  id: number
  title: string
  ticketId: string
  estimate: number
}

type CardsData = Map<Card['id'], Card>

export type ColumnsMapIds = [Column['id'], Card['id'][]][]

export const normalizeColumnsData = (
  data: ColumnsData,
): { cardsData: CardsData; columnsMapIds: ColumnsMapIds } => {
  const cardsData: CardsData = new Map()
  const columnsMapIds: ColumnsMapIds = []

  for (const column of data) {
    const cardIds: number[] = []
    for (const card of column.cards) {
      cardsData.set(card.id, card)
      cardIds.push(card.id)
    }
    columnsMapIds.push([column.id, cardIds])
  }

  return { cardsData, columnsMapIds }
}

const BoardCardContent = ({
  card,
  className,
  ref,
  style,
  ...props
}: {
  card: Card
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLDivElement | null>
}) => {
  return (
    <div
      className={`rounded-xl border bg-white p-3 shadow-xs transition-colors ${className}`}
      style={style}
      ref={ref}
      {...props}>
      <div className="text-foreground text-sm">{card.title}</div>
      <div className="text-muted-foreground mt-2 flex items-center justify-between gap-2 text-xs">
        <span className="bg-muted rounded-md px-2 py-0.5">{card.ticketId}</span>
        <span className="bg-muted ml-auto rounded-md px-2 py-0.5">
          {card.estimate}
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
    </div>
  )
}

const BoardCard = ({ card }: { card: Card }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id })

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <BoardCardContent
      card={card}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  )
}

const BoardColumn = ({
  cardIds,
  cardsData,
  columnId,
  title,
}: {
  columnId: number
  title: string
  cardIds: number[]
  cardsData: CardsData
}) => {
  const { setNodeRef } = useDroppable({ id: columnId })

  return (
    <div
      ref={setNodeRef}
      className="grid w-75 min-w-75 grid-rows-[auto_1fr] gap-2 rounded-xl border bg-gray-50 p-2">
      <div className="flex items-center justify-between p-2">
        <span className="text-md font-semibold">{title}</span>
        <span className="bg-muted rounded-lg px-2 py-0.5 text-sm font-medium">
          {cardIds.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <SortableContext
          items={cardIds}
          strategy={verticalListSortingStrategy}>
          {cardIds.map((id) => {
            const card = cardsData.get(id)
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

export const Board = ({
  columns: initialColumnsData,
  onColumnsChange,
}: {
  columns: ColumnsData
  onColumnsChange: (updated: ColumnsData) => void
}) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const { cardsData, columnsMapIds: initialMapIds } = useMemo(
    () => normalizeColumnsData(initialColumnsData),
    [initialColumnsData],
  )

  const [columnsMapIds, setColumnsMapIds] =
    useState<ColumnsMapIds>(initialMapIds)
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  useEffect(() => {
    setColumnsMapIds(initialMapIds)
  }, [initialMapIds])

  const animationFrameId = useRef<number | null>(null)

  const nextColumnsMapIds = useRef<ColumnsMapIds>(columnsMapIds)

  const findColumn = useCallback(
    (id: number) => {
      const column = columnsMapIds.find(([colId]) => colId === id)
      if (column) return column[0]

      for (const [colId, cardIds] of columnsMapIds) {
        if (cardIds.includes(id as number)) return colId
      }
      return null
    },
    [columnsMapIds],
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      const card = cardsData.get(active.id as number)
      if (card) {
        setActiveCard(card)
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
      nextColumnsMapIds.current = columnsMapIds
    },
    [cardsData, columnsMapIds],
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const activeId = active.id as number
      const overId = over.id as number

      const activeColId = findColumn(activeId)
      const overColId = findColumn(overId)

      if (!activeColId || !overColId) return

      if (activeColId === overColId) {
        return
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }

      animationFrameId.current = requestAnimationFrame(() => {
        setColumnsMapIds((prev) => {
          const updated: ColumnsMapIds = []
          let activeCardMoved = false

          for (const [colId, cardIds] of prev) {
            if (colId === activeColId) {
              updated.push([colId, cardIds.filter((id) => id !== activeId)])
            } else if (colId === overColId) {
              const nextCardIds = [...cardIds]
              const insertIndex = nextCardIds.includes(overId)
                ? nextCardIds.indexOf(overId)
                : nextCardIds.length

              if (!activeCardMoved) {
                nextCardIds.splice(insertIndex, 0, activeId)
                activeCardMoved = true
              }
              updated.push([colId, nextCardIds])
            } else {
              updated.push([colId, cardIds])
            }
          }
          nextColumnsMapIds.current = updated
          return updated
        })
        animationFrameId.current = null
      })
    },
    [findColumn],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
      setActiveCard(null)

      const { active, over } = event
      const activeId = active.id as number
      const overId = over?.id as number

      let finalColumnsMapIds = nextColumnsMapIds.current

      const activeColId = findColumn(activeId)
      const overColId = findColumn(overId)

      if (activeColId && overColId && activeColId === overColId) {
        const currentColumnIndex = finalColumnsMapIds.findIndex(
          ([colId]) => colId === activeColId,
        )
        if (currentColumnIndex !== -1) {
          const currentCardIds = [...finalColumnsMapIds[currentColumnIndex][1]]
          const oldIndex = currentCardIds.indexOf(activeId)
          const newIndex = currentCardIds.indexOf(overId)

          if (oldIndex !== -1 && newIndex !== -1) {
            const [removed] = currentCardIds.splice(oldIndex, 1)
            currentCardIds.splice(newIndex, 0, removed)

            finalColumnsMapIds = finalColumnsMapIds.map(([colId, cardIds]) =>
              colId === activeColId
                ? [colId, currentCardIds]
                : [colId, cardIds],
            ) as ColumnsMapIds
          } else if (oldIndex !== -1 && !overId && currentCardIds.length > 0) {
            const [removed] = currentCardIds.splice(oldIndex, 1)
            currentCardIds.push(removed)
            finalColumnsMapIds = finalColumnsMapIds.map(([colId, cardIds]) =>
              colId === activeColId
                ? [colId, currentCardIds]
                : [colId, cardIds],
            ) as ColumnsMapIds
          }
        }
      }

      const newColumnsData = finalColumnsMapIds.map(([colId, cardIds]) => {
        const originalColumn = initialColumnsData.find((c) => c.id === colId)
        return {
          cards: cardIds.map((id) => cardsData.get(id)!),
          id: colId,
          title: originalColumn?.title || `Column ${colId}`,
        }
      })
      onColumnsChange(newColumnsData)

      nextColumnsMapIds.current = newColumnsData.map((col) => [
        col.id,
        col.cards.map((c) => c.id),
      ])
    },
    [cardsData, initialColumnsData, onColumnsChange, findColumn],
  )

  const handleDragCancel = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
    setActiveCard(null)

    const newColumnsData = columnsMapIds.map(([colId, cardIds]) => {
      const originalColumn = initialColumnsData.find((c) => c.id === colId)
      return {
        cards: cardIds.map((id) => cardsData.get(id)!),
        id: colId,
        title: originalColumn?.title || `Column ${colId}`,
      }
    })
    onColumnsChange(newColumnsData)
  }, [columnsMapIds, cardsData, initialColumnsData, onColumnsChange])

  const customCollisionDetection: CollisionDetection = useCallback(
    (args) => {
      const { droppableContainers } = args

      const columnCollisions = closestCenter({
        ...args,
        droppableContainers: droppableContainers.filter((container) =>
          columnsMapIds.some(([colId]) => colId === container.id),
        ),
      })

      if (!columnCollisions.length) {
        return []
      }

      const closestColumn = columnCollisions[0]
      const closestColumnId = closestColumn.id

      const cardCollisions = closestCenter({
        ...args,
        droppableContainers: droppableContainers.filter((container) => {
          const cardIdsInClosestColumn = columnsMapIds.find(
            ([colId]) => colId === closestColumnId,
          )?.[1]
          return (
            cardIdsInClosestColumn &&
            cardIdsInClosestColumn.includes(container.id as number)
          )
        }),
      })

      if (cardCollisions.length > 0) {
        return cardCollisions
      }

      return columnCollisions
    },
    [columnsMapIds],
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}>
      <div className="flex h-full gap-2">
        {columnsMapIds.map(([columnId, cardIds]) => {
          const columnTitle =
            initialColumnsData.find((col) => col.id === columnId)?.title ||
            `Column ${columnId}`
          return (
            <BoardColumn
              key={columnId}
              columnId={columnId}
              title={columnTitle}
              cardIds={cardIds}
              cardsData={cardsData}
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
