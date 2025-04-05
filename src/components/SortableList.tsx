"use client";

import { ReactNode, useOptimistic, useTransition } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { actionToast } from "@/hooks/use-toast";
import { GripVerticalIcon } from "lucide-react";

export function SortableList<T extends { id: string }>({
  items,
  onOrderChange,
  children,
}: {
  items: T[];
  onOrderChange: (
    newOrder: string[]
  ) => Promise<{ error: boolean; message: string }>;
  children: (items: T[]) => ReactNode; //use render function pattern
}) {
  const [optimisticItems, setOptimisticItems] = useOptimistic(items);
  const [, startTransition] = useTransition()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeId = active.id.toString()
    const overId = over?.id.toString()
    if (overId == null || activeId == null) return

    function getNewArray(array: T[], activeId: string, overId: string) {
      const oldIndex = array.findIndex(section => section.id === activeId)
      const newIndex = array.findIndex(section => section.id === overId)
      return arrayMove(array, oldIndex, newIndex)
    }
    
    startTransition(async () => {
      setOptimisticItems(items => getNewArray(items, activeId, overId))
      const actionData = await onOrderChange(
        getNewArray(optimisticItems, activeId, overId).map(s => s.id)
      )

      actionToast({ actionData })
    })
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext
        items={optimisticItems}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col'>{children(optimisticItems)}</div>
      </SortableContext>
    </DndContext>
  );
}

export function SortableItem({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const { setNodeRef, transform, transition, activeIndex, index, attributes, listeners } = useSortable({ id });
  const isActive = activeIndex === index;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex gap-1 items-center bg-background rounded-lg p-2",
        isActive && "z-10 border shadow-md"
      )}
    >
      <GripVerticalIcon
        className="text-muted-foreground size-6 p-1"
        {...attributes}
        {...listeners}
      />
      <div className={cn("flex-grow", className)}>
        {children}
      </div>
    </div>
  );
}
