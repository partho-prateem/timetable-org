import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Session, TimetableGrid, detectConflicts } from "@/components/schedule/TimetableGrid";
import { useToast } from "@/hooks/use-toast";

const initial: Session[] = [
  { id: "s1", title: "Algorithms", color: "#5b7cfa", day: "Mon", hour: 9, duration: 2, batch: "2025-CSE-A", faculty: "Dr. Chen", room: "R101" },
  { id: "s2", title: "Physics", color: "#f97316", day: "Tue", hour: 10, duration: 1, batch: "2025-CSE-A", faculty: "Prof. Mills", room: "R202" },
  { id: "s3", title: "Databases", color: "#22c55e", day: "Wed", hour: 11, duration: 2, batch: "2025-ECE-A", faculty: "Dr. Díaz", room: "LAB-3" },
];

function findNextFreeSlot(items: Session[], forSession: Session) {
  const days = ["Mon","Tue","Wed","Thu","Fri"] as Session["day"][];
  // try same day next hours
  const occupied = new Set(items.filter(it=>it.id!==forSession.id).map(it=>`${it.day}:${it.hour}`));
  for (let h = forSession.hour + 1; h <= 17; h++) {
    if (!occupied.has(`${forSession.day}:${h}`)) return { day: forSession.day, hour: h };
  }
  // try other days same hour
  for (const d of days) {
    if (!occupied.has(`${d}:${forSession.hour}`)) return { day: d, hour: forSession.hour };
  }
  // fallback: same
  return { day: forSession.day, hour: forSession.hour };
}

export default function Timetables() {
  const [items, setItems] = useState<Session[]>(initial);
  const [viewBy, setViewBy] = useState<"batch" | "faculty" | "room">("batch");
  const { toast } = useToast();
  const conflicts = useMemo(()=>detectConflicts(items), [items]);

  const requestSuggestions = async () => {
    try {
      const res = await fetch("/api/ai/suggest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json() as { updates: { id: string; day: string; hour: number }[]; rationale: string };
      const updated = items.map((s) => {
        const u = data.updates.find((x) => x.id === s.id);
        return u ? { ...s, day: u.day as any, hour: u.hour } : s;
      });
      setItems(updated);
      toast({ title: "Applied AI suggestions", description: data.rationale });
    } catch (e: any) {
      toast({ title: "AI suggestions unavailable", description: e.message ?? "Configure OpenAI key to enable.", variant: "destructive" });
    }
  };

  const autoResolve = () => {
    let updated = [...items];
    const conflicted = Array.from(detectConflicts(updated));
    conflicted.forEach((id)=>{
      const idx = updated.findIndex(x=>x.id===id);
      if (idx===-1) return;
      const s = updated[idx];
      const next = findNextFreeSlot(updated, s);
      updated[idx] = { ...s, day: next.day as any, hour: next.hour };
    });
    setItems(updated);
    toast({ title: "Auto-resolve applied", description: "Attempted to move conflicting sessions to free slots." });
  };

  return (
    <AppLayout>
      <PageTitle title="Timetables" description="Drag-and-drop to rearrange. Use AI to suggest improvements." />
      <div className="flex items-center gap-3 mb-4">
        <Select value={viewBy} onValueChange={(v)=>setViewBy(v as any)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="View by"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="batch">By Batch</SelectItem>
            <SelectItem value="faculty">By Faculty</SelectItem>
            <SelectItem value="room">By Room</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={requestSuggestions}>Suggest rearrangement (AI)</Button>
        <Button variant="secondary" onClick={autoResolve} disabled={conflicts.size===0}>Auto-resolve conflicts</Button>
        {conflicts.size>0 && <div className="ml-auto text-sm text-red-600">{conflicts.size} conflict(s)</div>}
      </div>
      <TimetableGrid items={items} onChange={setItems} />
    </AppLayout>
  );
}
