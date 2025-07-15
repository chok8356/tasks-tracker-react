import { BoardColumn } from '@/pages/app/board-page/components/board/components/board-column.tsx'

const data = [
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

export const Board = () => {
  return (
    <div
      className="grid h-full gap-2"
      style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
      {/* Колонки */}
      {data.map((column) => (
        <BoardColumn
          key={column.id}
          id={column.id}
          title={column.title}
          cards={column.cards}></BoardColumn>
      ))}
    </div>
  )
}
