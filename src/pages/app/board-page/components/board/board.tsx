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
import { useState } from 'react'
import { createPortal } from 'react-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'

export type Columns = Column[]
export type Cards = Record<Card['id'], Card>

type Column = {
  id: number
  title: string
  cards: Card['id'][]
}

type Card = {
  id: number
  title: string
  ticketId: string
  estimate: number
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

const BoardColumn = ({ cards, column }: { column: Column; cards: Cards }) => {
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
