import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'

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
import React, { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Card = {
  assignee: string
  id: string
  rating: number
  ticketId: string
  title: string
}

type Column = {
  id: string
  title: string
  cards: Card[]
}

const initialData: Column[] = [
  {
    cards: [
      {
        assignee: 'user1',
        id: '1',
        rating: 8,
        ticketId: 'UX-908',
        title: 'Поиск - Личный Кабинет - Дешборды - Техдолг',
      },
      {
        assignee: 'user2',
        id: '2',
        rating: 5,
        ticketId: 'UX-912',
        title: 'Фикс валидации логина',
      },
      {
        assignee: 'user5',
        id: '5',
        rating: 6,
        ticketId: 'DEV-001',
        title: 'Настройка CI/CD для нового микросервиса',
      },
      {
        assignee: 'user6',
        id: '6',
        rating: 7,
        ticketId: 'FEAT-123',
        title: 'Реализация темной темы для приложения',
      },
    ],
    id: 'todo',
    title: 'TODO',
  },
  {
    cards: [
      {
        assignee: 'user3',
        id: '3',
        rating: 7,
        ticketId: 'UX-915',
        title: 'Редизайн страницы задач',
      },
      {
        assignee: 'user7',
        id: '7',
        rating: 8,
        ticketId: 'BUG-456',
        title: 'Исправить баг с бесконечной прокруткой на мобильных',
      },
      {
        assignee: 'user8',
        id: '8',
        rating: 6,
        ticketId: 'PERF-789',
        title: 'Оптимизация загрузки изображений на главной странице',
      },
    ],
    id: 'in-progress',
    title: 'In Progress',
  },
  {
    cards: [
      {
        assignee: 'user4',
        id: '4',
        rating: 9,
        ticketId: 'UX-901',
        title: 'Обновление зависимостей',
      },
      {
        assignee: 'user9',
        id: '9',
        rating: 10,
        ticketId: 'DEPLOY-001',
        title: 'Развертывание новой версии на продакшн',
      },
      {
        assignee: 'user10',
        id: '10',
        rating: 8,
        ticketId: 'DOCS-010',
        title: 'Обновление документации API',
      },
    ],
    id: 'done',
    title: 'Done',
  },
]

const CardView = ({
  card,
  className = '',
  ref,
  style,
  ...props
}: {
  card: Card
  className?: string
  style?: React.CSSProperties
} & React.HTMLAttributes<HTMLAnchorElement> & {
    ref?: React.RefObject<HTMLAnchorElement | null>
  }) => {
  return (
    <a
      ref={ref}
      style={style}
      href="#"
      className={`border-border hover:bg-muted grid rounded-xl border bg-white p-3 shadow-xs transition-colors ${className}`}
      {...props}>
      <div className="text-foreground text-sm">{card.title}</div>
      <div className="text-mutedForeground mt-2 flex items-center justify-between gap-2 text-xs">
        <span className="bg-muted rounded-md px-2 py-0.5">{card.ticketId}</span>
        <span className="bg-muted ml-auto rounded-md px-2 py-0.5">
          {card.rating}
        </span>
        <Avatar className="h-6 w-6 rounded-md">
          <AvatarImage
            src=""
            alt={card.assignee}
          />
          <AvatarFallback className="rounded-md">
            <UserIcon
              size={16}
              className="text-gray-400"
            />
          </AvatarFallback>
        </Avatar>
      </div>
    </a>
  )
}

const SortableCard: React.FC<{ card: Card }> = ({ card }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id })

  const style = {
    opacity: isDragging ? 0.3 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <CardView
      ref={setNodeRef}
      card={card}
      className="touch-none"
      style={style}
      {...attributes}
      {...listeners}
    />
  )
}

const ColumnContainer: React.FC<{ column: Column }> = ({ column }) => {
  const { isOver, setNodeRef } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={`border-border flex flex-col gap-2 rounded-2xl border p-2 ${
        isOver ? 'bg-blue-100' : 'bg-gray-50'
      }`}>
      <div className="flex items-center justify-between p-2">
        <span className="text-foreground text-md font-semibold">
          {column.title}
        </span>
        <span className="bg-muted text-mutedForeground rounded-lg px-2 py-0.5 text-sm font-medium">
          {column.cards.length}
        </span>
      </div>

      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {column.cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export const Board: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialData)
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const findColumnId = (cardId: string) =>
    columns.find((col) => col.cards.some((c) => c.id === cardId))?.id

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = event.active.id as string
    const col = columns.find((col) => col.cards.some((c) => c.id === cardId))
    const card = col?.cards.find((c) => c.id === cardId)
    if (card) setActiveCard(card)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      setActiveCard(null)
      return
    }

    const fromColId = findColumnId(active.id as string)
    const toColId = findColumnId(over.id as string)
    if (!fromColId || !toColId) {
      setActiveCard(null)
      return
    }

    const activeCardData = columns
      .find((col) => col.id === fromColId)!
      .cards.find((c) => c.id === active.id)!

    setColumns((cols) =>
      cols.map((col) => {
        if (col.id === fromColId) {
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== active.id),
          }
        }

        if (col.id === toColId) {
          const overIndex = col.cards.findIndex((c) => c.id === over.id)
          const insertAt = overIndex >= 0 ? overIndex : col.cards.length
          const newCards = [...col.cards]
          newCards.splice(insertAt, 0, activeCardData)
          return {
            ...col,
            cards: newCards,
          }
        }

        return col
      }),
    )

    setActiveCard(null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const fromCol = findColumnId(active.id as string)
    const toCol = findColumnId(over.id as string) ?? over.id

    if (!fromCol || !toCol || fromCol === toCol) return

    const activeCardData = columns
      .find((col) => col.id === fromCol)!
      .cards.find((c) => c.id === active.id)!

    const toColData = columns.find((col) => col.id === toCol)!
    const alreadyExists = toColData.cards.find((c) => c.id === active.id)
    if (alreadyExists) return // ⚠️ Не делать setState, если уже вставлено

    setColumns((cols) =>
      cols.map((col) => {
        if (col.id === fromCol) {
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== active.id),
          }
        }
        if (col.id === toCol) {
          const overIndex = col.cards.findIndex((c) => c.id === over.id)
          const insertIndex = overIndex >= 0 ? overIndex : col.cards.length
          const newCards = [...col.cards]
          newCards.splice(insertIndex, 0, activeCardData)
          return {
            ...col,
            cards: newCards,
          }
        }
        return col
      }),
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveCard(null)}
      onDragOver={handleDragOver}>
      <div
        className="grid h-full gap-2"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}>
        {columns.map((column) => (
          <ColumnContainer
            key={column.id}
            column={column}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard ? <CardView card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
