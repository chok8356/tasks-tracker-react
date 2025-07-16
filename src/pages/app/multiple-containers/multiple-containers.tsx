import type {
  CancelDrop,
  CollisionDetection,
  DropAnimation,
  KeyboardCoordinateGetter,
  Modifiers,
  UniqueIdentifier,
} from '@dnd-kit/core'
import type { SortingStrategy } from '@dnd-kit/sortable'

import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  getFirstCollision,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { ContainerProps } from './index'

import { createRange } from './createRange'
import { Container, Item } from './index'

export default {
  title: 'Presets/Sortable/Multiple Containers',
}

function DroppableContainer({
  children,
  columns = 1,
  id,
  items,
  style,
  ...props
}: ContainerProps & {
  id: UniqueIdentifier
  items: UniqueIdentifier[]
  style?: React.CSSProperties
}) {
  const { active, setNodeRef } = useDroppable({
    data: {
      children: items,
      type: 'container',
    },
    id,
  })
  const isOverContainer = active ? items.includes(active.id) : false

  return (
    <Container
      ref={setNodeRef}
      style={{
        ...style,
      }}
      hover={isOverContainer}
      columns={columns}
      {...props}>
      {children}
    </Container>
  )
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>

type Props = {
  adjustScale?: boolean
  cancelDrop?: CancelDrop
  columns?: number
  containerStyle?: React.CSSProperties
  coordinateGetter?: KeyboardCoordinateGetter

  getItemStyles?: (args: {
    value: UniqueIdentifier
    index: number
    overIndex: number
    isDragging: boolean
    containerId: UniqueIdentifier
    isSorting: boolean
    isDragOverlay: boolean
  }) => React.CSSProperties

  wrapperStyle?: (args: { index: number }) => React.CSSProperties

  itemCount?: number
  items?: Items
  handle?: boolean
  renderItem?: any
  strategy?: SortingStrategy
  modifiers?: Modifiers
  scrollable?: boolean
  vertical?: boolean
}

function getColor(id: UniqueIdentifier) {
  switch (String(id)[0]) {
    case 'A':
      return '#7193f1'
    case 'B':
      return '#ffda6c'
    case 'C':
      return '#00bcd4'
    case 'D':
      return '#ef769f'
  }
  return undefined
}

export function MultipleContainers({
  adjustScale = false,
  cancelDrop,
  columns,
  containerStyle,
  getItemStyles = () => ({}),
  handle = false,
  itemCount = 3,
  items: initialItems,
  modifiers,
  renderItem,
  scrollable,
  strategy = verticalListSortingStrategy,
  vertical = false,
  wrapperStyle = () => ({}),
}: Props) {
  const [items, setItems] = useState<Items>(
    () =>
      initialItems ?? {
        A: createRange(itemCount, (index) => `A${index + 1}`),
        B: createRange(itemCount, (index) => `B${index + 1}`),
        C: createRange(itemCount, (index) => `C${index + 1}`),
        D: createRange(itemCount, (index) => `D${index + 1}`),
      },
  )
  const [containers] = useState(Object.keys(items) as UniqueIdentifier[])
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (overId in items) {
          const containerItems = items[overId]
          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id),
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, items],
  )

  const [clonedItems, setClonedItems] = useState<Items | null>(null)
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id
    }
    return Object.keys(items).find((key) => items[key].includes(id))
  }

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id)
    if (!container) {
      return -1
    }
    return items[container].indexOf(id)
  }

  const onDragCancel = () => {
    if (clonedItems) {
      setItems(clonedItems)
    }
    setActiveId(null)
    setClonedItems(null)
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [items])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id)
        setClonedItems(items)
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id
        if (overId == null || active.id in items) {
          return
        }

        const overContainer = findContainer(overId)
        const activeContainer = findContainer(active.id)

        if (!overContainer || !activeContainer) {
          return
        }

        if (activeContainer !== overContainer) {
          setItems((items) => {
            const activeItems = items[activeContainer]
            const overItems = items[overContainer]
            const overIndex = overItems.indexOf(overId)
            const activeIndex = activeItems.indexOf(active.id)

            let newIndex: number
            if (overId in items) {
              newIndex = overItems.length + 1
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                  over.rect.top + over.rect.height
              const modifier = isBelowOverItem ? 1 : 0
              newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1
            }

            recentlyMovedToNewContainer.current = true

            return {
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (item) => item !== active.id,
              ),
              [overContainer]: [
                ...items[overContainer].slice(0, newIndex),
                items[activeContainer][activeIndex],
                ...items[overContainer].slice(newIndex),
              ],
            }
          })
        }
      }}
      onDragEnd={({ active, over }) => {
        const activeContainer = findContainer(active.id)
        if (!activeContainer) {
          setActiveId(null)
          return
        }

        const overId = over?.id
        if (overId == null) {
          setActiveId(null)
          return
        }

        const overContainer = findContainer(overId)
        if (overContainer) {
          const activeIndex = items[activeContainer].indexOf(active.id)
          const overIndex = items[overContainer].indexOf(overId)

          if (activeIndex !== overIndex || activeContainer === overContainer) {
            setItems((items) => ({
              ...items,
              [overContainer]: arrayMove(
                items[overContainer],
                activeIndex,
                overIndex,
              ),
            }))
          }
        }

        setActiveId(null)
      }}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}>
      <div
        style={{
          boxSizing: 'border-box',
          display: 'inline-grid',
          gridAutoFlow: vertical ? 'row' : 'column',
          padding: 20,
        }}>
        {containers.map((containerId) => (
          <DroppableContainer
            key={containerId}
            id={containerId}
            label={`Column ${containerId}`}
            columns={columns}
            items={items[containerId]}
            scrollable={scrollable}
            style={containerStyle}>
            <SortableContext
              items={items[containerId]}
              strategy={strategy}>
              {items[containerId].map((value, index) => (
                <SortableItem
                  key={value}
                  id={value}
                  index={index}
                  handle={handle}
                  style={getItemStyles}
                  wrapperStyle={wrapperStyle}
                  renderItem={renderItem}
                  containerId={containerId}
                  getIndex={getIndex}
                />
              ))}
            </SortableContext>
          </DroppableContainer>
        ))}
      </div>
      {createPortal(
        <DragOverlay
          adjustScale={adjustScale}
          dropAnimation={dropAnimation}>
          {activeId ? renderSortableItemDragOverlay(activeId) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )

  function renderSortableItemDragOverlay(id: UniqueIdentifier) {
    return (
      <Item
        value={id}
        handle={handle}
        style={getItemStyles({
          containerId: findContainer(id) as UniqueIdentifier,
          index: getIndex(id),
          isDragging: true,
          isDragOverlay: true,
          isSorting: true,
          overIndex: -1,
          value: id,
        })}
        color={getColor(id)}
        wrapperStyle={wrapperStyle({ index: 0 })}
        renderItem={renderItem}
        dragOverlay
      />
    )
  }
}

type SortableItemProps = {
  containerId: UniqueIdentifier
  getIndex: (id: UniqueIdentifier) => number
  handle: boolean
  id: UniqueIdentifier

  index: number

  renderItem: () => React.ReactElement

  style: (args: any) => React.CSSProperties

  wrapperStyle: ({ index }: { index: number }) => React.CSSProperties
}

function SortableItem({
  containerId,
  getIndex,
  handle,
  id,
  index,
  renderItem,
  style,
  wrapperStyle,
}: SortableItemProps) {
  const {
    isDragging,
    isSorting,
    listeners,
    over,
    overIndex,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  return (
    <Item
      ref={setNodeRef}
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
      style={style({
        containerId,
        index,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id) : overIndex,
        value: id,
      })}
      color={getColor(id)}
      transition={transition}
      transform={transform}
      listeners={listeners}
      renderItem={renderItem}
    />
  )
}
