import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import {
  Session,
  TimetableGrid,
  getConflictPairs,
  detectConflicts,
} from "@/components/schedule/TimetableGrid";
import ConflictPanel, { Suggestion } from "@/components/schedule/ConflictPanel";
import { useToast } from "@/hooks/use-toast";

const initial: Session[] = [
  {
    id: "s1",
    title: "Algorithms",
    color: "#5b7cfa",
    day: "Mon",
    hour: 9,
    duration: 2,
    batch: "2025-CSE-A",
    faculty: "Dr. Chen",
    room: "R101",
  },
  {
    id: "s2",
    title: "Physics",
    color: "#f97316",
    day: "Tue",
    hour: 10,
    duration: 1,
    batch: "2025-CSE-A",
    faculty: "Prof. Mills",
    room: "R202",
  },
  {
    id: "s3",
    title: "Databases",
    color: "#22c55e",
    day: "Wed",
    hour: 11,
    duration: 2,
    batch: "2025-ECE-A",
    faculty: "Dr. Díaz",
    room: "LAB-3",
  },
];

function findNextFreeSlot(items: Session[], forSession: Session) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"] as Session["day"][];
  const occupied = new Set(
    items
      .filter((it) => it.id !== forSession.id)
      .map((it) => `${it.day}:${it.hour}`),
  );
  for (let h = forSession.hour + 1; h <= 17; h++) {
    if (!occupied.has(`${forSession.day}:${h}`))
      return { day: forSession.day, hour: h };
  }
  for (const d of days) {
    if (!occupied.has(`${d}:${forSession.hour}`))
      return { day: d, hour: forSession.hour };
  }
  return { day: forSession.day, hour: forSession.hour };
}

function findDifferentRoom(items: Session[], forSession: Session) {
  const rooms = Array.from(new Set(items.map((i) => i.room)));
  const occupied = new Set(
    items
      .filter((it) => it.id !== forSession.id)
      .map((it) => `${it.day}:${it.hour}:${it.room}`),
  );
  for (const r of rooms) {
    if (!occupied.has(`${forSession.day}:${forSession.hour}:${r}`)) return r;
  }
  return null;
}

export default function Timetables() {
  const [items, setItems] = useState<Session[]>(initial);
  const [viewBy, setViewBy] = useState<"batch" | "faculty" | "room">("batch");
  const { toast } = useToast();
  const conflictSet = useMemo(() => detectConflicts(items), [items]);
  const pairs = useMemo(() => getConflictPairs(items), [items]);

  const buildSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    for (const p of pairs) {
      // choose which session to move
      const a = items.find((x) => x.id === p.aId)!;
      const b = items.find((x) => x.id === p.bId)!;
      // heuristic: prefer moving when reason includes 'room' => change room if possible
      let target = b;
      if (p.reasons.includes("room")) {
        const newRoom = findDifferentRoom(items, b);
        if (newRoom) {
          // suggest changing room (represented as moving to same slot but different room -> still express as same time)
          suggestions.push({
            id: b.id,
            from: { day: b.day, hour: b.hour },
            to: { day: b.day, hour: b.hour },
            reason: "change room to free room",
          });
          continue;
        }
      }
      // else prefer moving the one with fewer conflicts
      const aConfCount = pairs.filter(
        (pp) => pp.aId === a.id || pp.bId === a.id,
      ).length;
      const bConfCount = pairs.filter(
        (pp) => pp.aId === b.id || pp.bId === b.id,
      ).length;
      if (aConfCount <= bConfCount) target = a;
      else target = b;
      const next = findNextFreeSlot(items, target);
      suggestions.push({
        id: target.id,
        from: { day: target.day, hour: target.hour },
        to: { day: next.day, hour: next.hour },
        reason: `move to reduce conflicts (${p.reasons.join(",")})`,
      });
    }
    // dedupe by id (take first suggestion per session)
    const map = new Map<string, Suggestion>();
    for (const s of suggestions) if (!map.has(s.id)) map.set(s.id, s);
    return Array.from(map.values());
  };

  const suggestions = useMemo(() => buildSuggestions(), [items]);

  const applySuggestion = (s: Suggestion) => {
    let updated = [...items];
    const idx = updated.findIndex((x) => x.id === s.id);
    if (idx === -1) return;
    // if changing room only (from==to) and reason mentions room, try to find new room and update
    if (
      s.from.day === s.to.day &&
      s.from.hour === s.to.hour &&
      s.reason.includes("room")
    ) {
      const newRoom = findDifferentRoom(items, updated[idx]);
      if (newRoom) {
        updated[idx] = { ...updated[idx], room: newRoom };
      }
    } else {
      updated[idx] = { ...updated[idx], day: s.to.day as any, hour: s.to.hour };
    }
    setItems(updated);
    toast({ title: "Suggestion applied", description: `${s.id} moved` });
  };

  const applyAll = () => {
    for (const s of suggestions) applySuggestion(s);
    toast({ title: "Applied all suggestions" });
  };

  const requestSuggestions = async () => {
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as {
        updates: { id: string; day: string; hour: number }[];
        rationale: string;
      };
      const updated = items.map((s) => {
        const u = data.updates.find((x) => x.id === s.id);
        return u ? { ...s, day: u.day as any, hour: u.hour } : s;
      });
      setItems(updated);
      toast({ title: "Applied AI suggestions", description: data.rationale });
    } catch (e: any) {
      toast({
        title: "AI suggestions unavailable",
        description: e.message ?? "Configure OpenAI key to enable.",
        variant: "destructive",
      });
    }
  };

  const autoResolve = () => {
    let updated = [...items];
    const conflicted = Array.from(conflictSet);
    conflicted.forEach((id) => {
      const idx = updated.findIndex((x) => x.id === id);
      if (idx === -1) return;
      const s = updated[idx];
      const next = findNextFreeSlot(updated, s);
      updated[idx] = { ...s, day: next.day as any, hour: next.hour };
    });
    setItems(updated);
    toast({
      title: "Auto-resolve applied",
      description: "Attempted to move conflicting sessions to free slots.",
    });
  };

  return (
    <AppLayout>
      <PageTitle
        title="Timetables"
        description="Drag-and-drop to rearrange. Use AI to suggest improvements."
      />
      <div className="flex items-center gap-3 mb-4">
        <Select value={viewBy} onValueChange={(v) => setViewBy(v as any)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="View by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="batch">By Batch</SelectItem>
            <SelectItem value="faculty">By Faculty</SelectItem>
            <SelectItem value="room">By Room</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={requestSuggestions}>Suggest rearrangement (AI)</Button>
        <Button
          variant="secondary"
          onClick={autoResolve}
          disabled={conflictSet.size === 0}
        >
          Auto-resolve conflicts
        </Button>
        {conflictSet.size > 0 && (
          <div className="ml-auto text-sm text-red-600">
            {conflictSet.size} conflict(s)
          </div>
        )}
      </div>
      <ConflictPanel
        suggestions={suggestions}
        onApply={applySuggestion}
        onApplyAll={applyAll}
      />
      <TimetableGrid items={items} onChange={setItems} />
    </AppLayout>
  );
}
