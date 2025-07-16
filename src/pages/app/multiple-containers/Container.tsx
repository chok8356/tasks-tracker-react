import React from 'react'

import { cn } from '@/lib/utils.ts'

import styles from './Container.module.css'

export type Props = {
  children: React.ReactNode
  columns?: number
  handleProps?: React.HTMLAttributes<any>
  horizontal?: boolean
  hover?: boolean
  label?: string
  onClick?: () => void
  onRemove?: () => void
  placeholder?: boolean
  scrollable?: boolean
  shadow?: boolean
  style?: React.CSSProperties
  unstyled?: boolean
}

export const Container = ({
  children,
  columns = 1,
  handleProps,
  horizontal,
  hover,
  label,
  onClick,
  onRemove,
  placeholder,
  ref,
  scrollable,
  shadow,
  style,
  unstyled,
  ...props
}: Props & { ref?: any }) => {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      {...props}
      ref={ref}
      style={
        {
          ...style,
          '--columns': columns,
        } as React.CSSProperties
      }
      className={cn(
        styles.Container,
        unstyled && styles.unstyled,
        horizontal && styles.horizontal,
        hover && styles.hover,
        placeholder && styles.placeholder,
        scrollable && styles.scrollable,
        shadow && styles.shadow,
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}>
      {label ? <div className={styles.Header}>{label}</div> : null}
      {placeholder ? children : <ul>{children}</ul>}
    </Component>
  )
}
