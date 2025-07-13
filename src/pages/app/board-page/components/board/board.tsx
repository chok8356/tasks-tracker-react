import { UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const data = [
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
    ],
    count: 2,
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
    ],
    count: 1,
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
    ],
    count: 1,
    id: 'done',
    title: 'Done',
  },
]

export const Board = () => {
  return (
    <div
      className="grid h-full gap-2"
      style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
      {/* Колонки */}
      {data.map((column) => (
        <div
          key={column.id}
          className="border-border flex flex-col gap-2 rounded-2xl border bg-gray-50 p-2">
          {/* Заголовок колонки */}
          <div className="flex items-center justify-between p-2">
            <span className="text-foreground text-md font-semibold">
              {column.title}
            </span>
            <span className="bg-muted text-mutedForeground rounded-lg px-2 py-0.5 text-sm font-medium">
              {column.count}
            </span>
          </div>

          {/* Карточки */}
          <div className="flex flex-col gap-2">
            {column.cards.map((card) => (
              <a
                key={card.id}
                href="#"
                className="border-border hover:bg-muted rounded-xl border bg-white p-3 shadow-xs transition-colors">
                <div className="text-foreground text-sm">{card.title}</div>

                <div className="text-mutedForeground mt-2 flex items-center justify-between gap-2 text-xs">
                  <span className="bg-muted rounded-md px-2 py-0.5">
                    {card.ticketId}
                  </span>

                  <span className="bg-muted ml-auto rounded-md px-2 py-0.5">
                    {card.rating}
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
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
