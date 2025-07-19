import type { CSSProperties } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { BoardCardContent } from '@/pages/app/board-page/components/board/components/board-card-content.tsx'

import type { Card } from '../types'

export const BoardCard = ({ card }: { card: Card }) => {
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
