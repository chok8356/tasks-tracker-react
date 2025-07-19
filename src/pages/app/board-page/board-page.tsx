import { useState } from 'react'

import type {
  Cards,
  Columns,
} from '@/pages/app/board-page/components/board/types'

import { Board } from '@/pages/app/board-page/components/board/board.tsx'

export const BoardPage = () => {
  const columnsData: Columns = [
    { cards: [101, 102, 103, 104], id: 201, title: 'TODO' },
    { cards: [105, 106, 107], id: 202, title: 'In Progress' },
    { cards: [108, 109, 110], id: 203, title: 'Done' },
  ]

  const cardsData: Cards = {
    101: {
      estimate: 8,
      id: 101,
      ticketId: 'UX-908',
      title: 'Поиск - Личный Кабинет - Дешборды - Техдолг',
    },
    102: {
      estimate: 5,
      id: 102,
      ticketId: 'UX-912',
      title: 'Фикс валидации логина',
    },
    103: {
      estimate: 6,
      id: 103,
      ticketId: 'DEV-001',
      title: 'Настройка CI/CD для нового микросервиса',
    },
    104: {
      estimate: 7,
      id: 104,
      ticketId: 'FEAT-123',
      title: 'Реализация темной темы для приложения',
    },
    105: {
      estimate: 7,
      id: 105,
      ticketId: 'UX-915',
      title: 'Редизайн страницы задач',
    },
    106: {
      estimate: 8,
      id: 106,
      ticketId: 'BUG-456',
      title: 'Исправить баг с бесконечной прокруткой на мобильных',
    },
    107: {
      estimate: 6,
      id: 107,
      ticketId: 'PERF-789',
      title: 'Оптимизация загрузки изображений на главной странице',
    },
    108: {
      estimate: 9,
      id: 108,
      ticketId: 'UX-901',
      title: 'Обновление зависимостей',
    },
    109: {
      estimate: 10,
      id: 109,
      ticketId: 'DEPLOY-001',
      title: 'Развертывание новой версии на продакшн',
    },
    110: {
      estimate: 8,
      id: 110,
      ticketId: 'DOCS-010',
      title: 'Обновление документации API',
    },
  }

  const [columns, setColumns] = useState<Columns>(columnsData)
  const [cards] = useState<Cards>(cardsData)

  return (
    <div className="h-full">
      <Board
        columns={columns}
        cards={cards}
        onColumnsChange={setColumns}></Board>
    </div>
  )
}
