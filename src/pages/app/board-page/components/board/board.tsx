import { UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'

const data = [
  {
    cards: [
      {
        assignee: 'user1',
        id: '1',
        ticketId: 'UX-908',
        title: 'Поиск - Личный Кабинет - Дешборды - Техдолг',
      },
      {
        assignee: 'user2',
        id: '2',
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
    <div className="grid h-full grid-cols-3 gap-2">
      {data.map((column) => (
        <div
          key={column.id}
          className="rounded-sm bg-gray-100 p-2">
          <div className="mb-2 flex items-center justify-between p-2">
            <span className="font-medium">{column.title}</span>
            <span className="rounded-sm bg-gray-200/75 px-1.5 text-sm font-medium">
              {column.count}
            </span>
          </div>

          {column.cards.map((card) => (
            <a
              key={card.id}
              href="#"
              className="mb-2 grid gap-2 rounded-sm bg-white p-2 text-sm shadow-xs hover:bg-gray-200">
              <span>{card.title}</span>
              <div className="flex items-center justify-between gap-2">
                <span className="bg-muted rounded-xs px-1 text-xs">
                  {card.ticketId}
                </span>
                <span className="bg-muted ml-auto rounded-xs px-1 text-xs">
                  10
                </span>
                <Avatar className="h-6 w-6 rounded-lg">
                  <AvatarImage />
                  <AvatarFallback className="rounded-lg">
                    <UserIcon
                      className="text-gray-400"
                      size="16"
                    />
                  </AvatarFallback>
                </Avatar>
              </div>
            </a>
          ))}
        </div>
      ))}
    </div>
  )
}
