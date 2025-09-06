import { DndContext, DragEndEvent, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors, useDraggable, useDroppable } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
export const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8..17

export type Session = {
  id: string;
  title: string;
  color: string;
  day: Day;
  hour: number; // starting hour
  duration: number; // hours
  batch: string;
  faculty: string;
  room: string;
};

export function detectConflicts(items: Session[]) {
  const conflicted = new Set<string>();
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (a.day !== b.day) continue;
      const aStart = a.hour;
      const aEnd = a.hour + Math.max(1, a.duration);
      const bStart = b.hour;
      const bEnd = b.hour + Math.max(1, b.duration);
      const overlap = aStart < bEnd && bStart < aEnd;
      const resourceConflict = a.batch === b.batch || a.faculty === b.faculty || a.room === b.room;
      if (overlap && resourceConflict) {
        conflicted.add(a.id);
        conflicted.add(b.id);
      }
    }
  }
  return conflicted;
}

export function TimetableGrid({ items, onChange }: { items: Session[]; onChange: (updated: Session[]) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const activeItem = useMemo(() => items.find((i) => i.id === activeId) ?? null, [activeId, items]);
  const conflicts = useMemo(() => detectConflicts(items), [items]);

  const onDragEnd = (e: DragEndEvent) => {
    const id = e.active.id as string;
    const over = e.over?.id as string | undefined;
    setActiveId(null);
    if (!over) return;
    const [day, hourStr] = over.split(":");
    const hour = parseInt(hourStr, 10);
    const idx = items.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const moved: Session = { ...items[idx], day: day as Day, hour };
    const updated = [...items];
    updated[idx] = moved;
    onChange(updated);
  };

  return (
    <DndContext sensors={sensors} onDragStart={(e)=>setActiveId(e.active.id as string)} onDragEnd={onDragEnd} onDragCancel={()=>setActiveId(null)} modifiers={[restrictToParentElement]}>
      <div className="grid shadow-sm" style={{ gridTemplateColumns: `80px repeat(${DAYS.length}, minmax(0, 1fr))` }}>
        <div />
        {DAYS.map((d) => (
          <div key={d} className="px-2 py-2 text-sm font-medium text-center sticky top-0 bg-background z-[1] border-b">
            {d}
          </div>
        ))}
        {HOURS.map((h) => (
          <Row key={h} hour={h} items={items} conflicts={conflicts} />
        ))}
      </div>
      <DragOverlay>{activeItem ? <SessionCard s={activeItem} dragging /> : null}</DragOverlay>
    </DndContext>
  );
}

function Row({ hour, items, conflicts }: { hour: number; items: Session[]; conflicts: Set<string> }) {
  return (
    <>
      <div className="border-r py-4 pr-2 text-xs text-muted-foreground sticky left-0 bg-background z-[1]">{hour}:00</div>
      {DAYS.map((d) => (
        <Cell key={`${d}:${hour}`} day={d} hour={hour} items={items} conflicts={conflicts} />
      ))}
    </>
  );
}

function Cell({ day, hour, items, conflicts }: { day: Day; hour: number; items: Session[]; conflicts: Set<string> }) {
  const sessions = items.filter((s) => s.day === day && s.hour === hour);
  const { isOver, setNodeRef } = useDroppable({ id: `${day}:${hour}` });

  return (
    <div ref={setNodeRef} id={`${day}:${hour}`} className={cn("border min-h-[72px] relative bg-white/50", isOver && "ring-2 ring-offset-2 ring-indigo-300") }>
      {sessions.map((s) => (
        <Draggable key={s.id} id={s.id}>
          <SessionCard s={s} conflicted={conflicts.has(s.id)} />
        </Draggable>
      ))}
    </div>
  );
}

function Draggable({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={cn("absolute inset-1 transition-transform", isDragging && "z-30 scale-105 shadow-lg")}
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}>
      {children}
    </div>
  );
}

function SessionCard({ s, dragging, conflicted }: { s: Session; dragging?: boolean; conflicted?: boolean }) {
  return (
    <div className={cn("rounded-md p-3 text-xs text-white shadow-md border", conflicted ? "border-red-600/80" : "border-transparent", dragging ? "opacity-95 scale-105" : "")}
      style={{ background: s.color }}>
      <div className="font-medium text-sm leading-tight">{s.title}</div>
      <div className="opacity-90 text-[12px]">{s.batch} • {s.room}</div>
      <div className="opacity-90 text-[12px]">{s.faculty}</div>
    </div>
  );
}
