import { useState } from 'react'

import type { Columns } from '@/pages/app/board-page/components/board/board.tsx'

import { Board } from '@/pages/app/board-page/components/board/board.tsx'

export const BoardPage = () => {
  const data: Columns = [
    {
      cards: [
        {
          estimate: 8,
          id: 101,
          ticketId: 'UX-908',
          title: 'Поиск - Личный Кабинет - Дешборды - Техдолг',
        },
        {
          estimate: 5,
          id: 102,
          ticketId: 'UX-912',
          title: 'Фикс валидации логина',
        },
        {
          estimate: 6,
          id: 103,
          ticketId: 'DEV-001',
          title: 'Настройка CI/CD для нового микросервиса',
        },
        {
          estimate: 7,
          id: 104,
          ticketId: 'FEAT-123',
          title: 'Реализация темной темы для приложения',
        },
      ],
      id: 201,
      title: 'TODO',
    },
    {
      cards: [
        {
          estimate: 7,
          id: 105,
          ticketId: 'UX-915',
          title: 'Редизайн страницы задач',
        },
        {
          estimate: 8,
          id: 106,
          ticketId: 'BUG-456',
          title: 'Исправить баг с бесконечной прокруткой на мобильных',
        },
        {
          estimate: 6,
          id: 107,
          ticketId: 'PERF-789',
          title: 'Оптимизация загрузки изображений на главной странице',
        },
      ],
      id: 202,
      title: 'In Progress',
    },
    {
      cards: [
        {
          estimate: 9,
          id: 108,
          ticketId: 'UX-901',
          title: 'Обновление зависимостей',
        },
        {
          estimate: 10,
          id: 109,
          ticketId: 'DEPLOY-001',
          title: 'Развертывание новой версии на продакшн',
        },
        {
          estimate: 8,
          id: 110,
          ticketId: 'DOCS-010',
          title: 'Обновление документации API',
        },
      ],
      id: 203,
      title: 'Done',
    },
  ]

  const [columns, setColumns] = useState<Columns>(data)

  return (
    <div className="h-full">
      <Board
        columns={columns}
        onColumnsChange={setColumns}></Board>
    </div>
  )
}
