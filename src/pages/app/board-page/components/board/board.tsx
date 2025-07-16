import type { DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { CSSProperties, Ref } from 'react'

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
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
import { useMemo, useState } from 'react'
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

type ColumnsMapIds = [Column['id'], Card['id'][]][]

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
        <span className="text-muted bg-muted rounded-lg px-2 py-0.5 text-sm">
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const card = cardsData.get(active.id as number)
    if (card) {
      setActiveCard(card)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id as number
    const overId = over.id as number

    let activeColId: number | null = null
    let overColId: number | null = null

    for (const [colId, cardIds] of columnsMapIds) {
      if (cardIds.includes(activeId)) activeColId = colId
      if (colId === overId || cardIds.includes(overId)) overColId = colId
    }

    if (!activeColId || !overColId || activeColId === overColId) return

    setColumnsMapIds((prev) => {
      const updated: ColumnsMapIds = []

      for (const [colId, cardIds] of prev) {
        if (colId === activeColId) {
          updated.push([colId, cardIds.filter((id) => id !== activeId)])
        } else if (colId === overColId) {
          const index = cardIds.indexOf(overId)
          const insertAt = index >= 0 ? index : cardIds.length
          const next = [...cardIds]
          next.splice(insertAt, 0, activeId)
          updated.push([colId, next])
        } else {
          updated.push([colId, cardIds])
        }
      }

      return updated
    })
  }

  const handleDragEnd = () => {
    setActiveCard(null)
  }
  const handleDragCancel = () => {
    setActiveCard(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}>
      <div className="flex h-full gap-2">
        {columnsMapIds.map(([columnId, cardIds]) => (
          <BoardColumn
            key={columnId}
            columnId={columnId}
            title={`Column ${columnId}`}
            cardIds={cardIds}
            cardsData={cardsData}
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
