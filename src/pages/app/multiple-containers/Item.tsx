import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'

import React, { useEffect } from 'react'

import { cn } from '@/lib/utils.ts'

import styles from './Item.module.css'

export type Props = {
  color?: string
  disabled?: boolean
  dragging?: boolean
  dragOverlay?: boolean
  fadeIn?: boolean
  handle?: boolean
  handleProps?: any
  height?: number
  index?: number
  listeners?: DraggableSyntheticListeners
  onRemove?: () => void
  renderItem?: (args: {
    dragOverlay: boolean
    dragging: boolean
    sorting: boolean
    index: number | undefined
    fadeIn: boolean
    listeners: DraggableSyntheticListeners
    ref: any
    style: React.CSSProperties | undefined
    transform: Props['transform']
    transition: Props['transition']
    value: Props['value']
  }) => React.ReactElement
  sorting?: boolean
  style?: React.CSSProperties
  transform?: Transform | null
  transition?: string | null
  value: React.ReactNode
  wrapperStyle?: React.CSSProperties
}

export const Item = React.memo(
  ({
    color,
    disabled,
    dragging,
    dragOverlay,
    fadeIn,
    handle,
    handleProps,
    height,
    index,
    listeners,
    onRemove,
    ref,
    renderItem,
    sorting,
    style,
    transform,
    transition,
    value,
    wrapperStyle,
    ...props
  }: Props & { ref?: any }) => {
    useEffect(() => {
      if (!dragOverlay) {
        return
      }

      document.body.style.cursor = 'grabbing'

      return () => {
        document.body.style.cursor = ''
      }
    }, [dragOverlay])

    return renderItem ? (
      renderItem({
        dragging: Boolean(dragging),
        dragOverlay: Boolean(dragOverlay),
        fadeIn: Boolean(fadeIn),
        index,
        listeners,
        ref,
        sorting: Boolean(sorting),
        style,
        transform,
        transition,
        value,
      })
    ) : (
      <li
        className={cn(
          styles.Wrapper,
          fadeIn && styles.fadeIn,
          sorting && styles.sorting,
          dragOverlay && styles.dragOverlay,
        )}
        style={
          {
            ...wrapperStyle,
            '--color': color,
            '--index': index,
            '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
            '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
            '--translate-x': transform
              ? `${Math.round(transform.x)}px`
              : undefined,
            '--translate-y': transform
              ? `${Math.round(transform.y)}px`
              : undefined,
            transition: [transition, wrapperStyle?.transition]
              .filter(Boolean)
              .join(', '),
          } as React.CSSProperties
        }
        ref={ref}>
        <div
          className={cn(
            'bg-white',
            styles.Item,
            dragging && styles.dragging,
            handle && styles.withHandle,
            dragOverlay && styles.dragOverlay,
            disabled && styles.disabled,
            color && styles.color,
          )}
          style={style}
          data-cypress="draggable-item"
          {...(!handle ? listeners : undefined)}
          {...props}
          tabIndex={!handle ? 0 : undefined}>
          {value}
        </div>
      </li>
    )
  },
)
