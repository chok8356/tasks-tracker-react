import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'

import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import {
  arrayMove,
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
  cards: Card[]
  id: string
  title: string
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

type SortableCardProps = {
  card: Card
}

const SortableCard: React.FC<SortableCardProps> = ({ card }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.id,
    })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <a
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      href="#"
      className="border-border hover:bg-muted rounded-xl border bg-white p-3 shadow-xs transition-colors">
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

type ColumnContainerProps = {
  column: Column
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({ column }) => {
  return (
    <div
      id={column.id}
      className="border-border flex flex-col gap-2 rounded-2xl border bg-gray-50 p-2">
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

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  function findColumnId(cardId: string): string | undefined {
    return columns.find((col) => col.cards.some((c) => c.id === cardId))?.id
  }

  function moveCardBetweenColumns(
    cols: Column[],
    cardId: string,
    fromCol: string,
    toCol: string,
  ): Column[] {
    const card = cols
      .find((c) => c.id === fromCol)!
      .cards.find((c) => c.id === cardId)!

    return cols.map((c) => {
      if (c.id === fromCol) {
        return { ...c, cards: c.cards.filter((c) => c.id !== cardId) }
      }
      if (c.id === toCol) {
        return { ...c, cards: [...c.cards, card] }
      }
      return c
    })
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const fromCol = findColumnId(active.id as string)
    const toCol = findColumnId(over.id as string) ?? over.id

    if (fromCol && toCol && fromCol !== toCol) {
      setColumns((cols) =>
        moveCardBetweenColumns(
          cols,
          active.id as string,
          fromCol,
          toCol as string,
        ),
      )
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const colId = findColumnId(active.id as string)
    if (!colId) return

    setColumns((cols) =>
      cols.map((col) => {
        if (col.id !== colId) return col

        const oldIndex = col.cards.findIndex((c) => c.id === active.id)
        const newIndex = col.cards.findIndex((c) => c.id === over.id)

        return {
          ...col,
          cards: arrayMove(col.cards, oldIndex, newIndex),
        }
      }),
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
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
    </DndContext>
  )
}
