import type { LucideIcon } from 'lucide-react'

import { ArrowUp, Book, Bookmark, Bug, CheckSquare } from 'lucide-react'

import type { IssueType } from '@/domain/types.ts'

import { cn } from '@/ui/shadcn/lib/utils.ts'

export const ISSUE_TYPE_COLORS = [
  'red',
  'yellow',
  'green',
  'blue',
  'indigo',
] as const satisfies readonly IssueType['color'][]

export const ISSUE_TYPE_ICONS = [
  'Bug',
  'CheckSquare',
  'Book',
  'ArrowUp',
  'Bookmark',
] as const satisfies readonly IssueType['icon'][]

export const ISSUE_TYPE_COLORS_BG_CLASSES: Record<IssueType['color'], string> =
  {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    indigo: 'bg-indigo-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  }

const ISSUE_TYPE_COLORS_TEXT_CLASSES: Record<IssueType['color'], string> = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  indigo: 'text-indigo-500',
  red: 'text-red-500',
  yellow: 'text-yellow-500',
}

export const ISSUE_TYPE_ICONS_COMPONENTS: Record<
  IssueType['icon'],
  LucideIcon
> = {
  ArrowUp,
  Book,
  Bookmark,
  Bug,
  CheckSquare,
}

export function getIssueIcon(params: {
  className?: string
  color?: IssueType['color']
  icon: IssueType['icon']
}) {
  const colorClass = params.color
    ? ISSUE_TYPE_COLORS_TEXT_CLASSES[params.color]
    : ''
  const IconComponent = ISSUE_TYPE_ICONS_COMPONENTS[params.icon]

  return <IconComponent className={cn(colorClass, params.className)} />
}
