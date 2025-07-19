export type Columns = Column[]
export type Cards = Record<Card['id'], Card>

export type Column = {
  id: number
  title: string
  cards: Card['id'][]
}

export type Card = {
  id: number
  title: string
  ticketId: string
  estimate: number
}
