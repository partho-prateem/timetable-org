import { DndContext, DragEndEvent, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
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

export function TimetableGrid({ items, onChange }: { items: Session[]; onChange: (updated: Session[]) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const activeItem = useMemo(() => items.find((i) => i.id === activeId) ?? null, [activeId, items]);

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
      <div className="grid" style={{ gridTemplateColumns: `80px repeat(${DAYS.length}, minmax(0, 1fr))` }}>
        <div />
        {DAYS.map((d) => (
          <div key={d} className="px-2 py-2 text-sm font-medium text-center sticky top-0 bg-background z-[1] border-b">
            {d}
          </div>
        ))}
        {HOURS.map((h) => (
          <Row key={h} hour={h} items={items} />
        ))}
      </div>
      <DragOverlay>{activeItem ? <SessionCard s={activeItem} dragging /> : null}</DragOverlay>
    </DndContext>
  );
}

function Row({ hour, items }: { hour: number; items: Session[] }) {
  return (
    <>
      <div className="border-r py-4 pr-2 text-xs text-muted-foreground sticky left-0 bg-background z-[1]">{hour}:00</div>
      {DAYS.map((d) => (
        <Cell key={`${d}:${hour}`} day={d} hour={hour} items={items} />
      ))}
    </>
  );
}

function Cell({ day, hour, items }: { day: Day; hour: number; items: Session[] }) {
  const sessions = items.filter((s) => s.day === day && s.hour === hour);
  return (
    <div id={`${day}:${hour}`} className="border min-h-[72px] relative">
      {sessions.map((s) => (
        <Draggable key={s.id} id={s.id}>
          <SessionCard s={s} />
        </Draggable>
      ))}
    </div>
  );
}

import { useDraggable } from "@dnd-kit/core";
function Draggable({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={cn("absolute inset-1", isDragging && "z-10")}
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}>
      {children}
    </div>
  );
}

function SessionCard({ s, dragging }: { s: Session; dragging?: boolean }) {
  return (
    <div className={cn("rounded-md p-2 text-xs text-white shadow", dragging ? "opacity-90" : "")} style={{ background: s.color }}>
      <div className="font-medium text-[11px] leading-tight">{s.title}</div>
      <div className="opacity-80">{s.batch} • {s.room}</div>
      <div className="opacity-80">{s.faculty}</div>
    </div>
  );
}
