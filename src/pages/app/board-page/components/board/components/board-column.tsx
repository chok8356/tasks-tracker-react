import { BoardCard } from '@/pages/app/board-page/components/board/components/board-card.tsx'

export const BoardColumn = (props: {
  id: number
  title: string
  cards: {
    id: number
    title: string
    ticketId: string
    estimate: number
  }[]
}) => {
  return (
    <div
      key={props.id}
      className="border-border flex flex-col gap-2 rounded-2xl border bg-gray-50 p-2">
      {/* Title */}
      <div className="flex items-center justify-between p-2">
        <span className="text-foreground text-md font-semibold">
          {props.title}
        </span>
        <span className="bg-muted text-mutedForeground rounded-lg px-2 py-0.5 text-sm font-medium">
          {props.cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {props.cards.map((card) => (
          <BoardCard
            key={card.id}
            id={card.id}
            estimate={card.estimate}
            ticketId={card.ticketId}
            title={card.title}></BoardCard>
        ))}
      </div>
    </div>
  )
}
