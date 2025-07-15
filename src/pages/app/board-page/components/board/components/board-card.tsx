import type { CSSProperties } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { BoardCardContent } from './board-card-content'

export type Card = {
  id: number
  title: string
  ticketId: string
  estimate: number
}

export const BoardCard = ({ card }: { card: Card }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: card.id,
  })

  // Стили для анимации и отображения
  const style: CSSProperties = {
    // Делаем оригинальную карточку полупрозрачной во время перетаскивания
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
