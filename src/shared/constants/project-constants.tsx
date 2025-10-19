import { cn } from '@/ui/shadcn/lib/utils'

export const ISSUE_STATUS_CATEGORIES = ['todo', 'in_progress', 'done'] as const

export type IssueStatusCategory = (typeof ISSUE_STATUS_CATEGORIES)[number]

export const ISSUE_STATUS_CATEGORY_TEXTS: Record<IssueStatusCategory, string> =
  {
    done: 'Done',
    in_progress: 'In Progress',
    todo: 'To Do',
  }

const ISSUE_STATUS_CATEGORY_CLASSES: Record<IssueStatusCategory, string> = {
  done: 'bg-green-600',
  in_progress: 'bg-blue-600',
  todo: 'bg-gray-600',
}

export function getIssueStatus(params: {
  category: IssueStatusCategory
  className?: string
  name: string
}) {
  const colorClass = ISSUE_STATUS_CATEGORY_CLASSES[params.category]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded px-0.75 py-0.5 text-sm leading-none text-white/90',
        colorClass,
        params.className,
      )}>
      <span className={cn()}>{params.name}</span>
    </div>
  )
}
