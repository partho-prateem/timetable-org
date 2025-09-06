import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Session, TimetableGrid } from "@/components/schedule/TimetableGrid";
import { useToast } from "@/hooks/use-toast";

const initial: Session[] = [
  { id: "s1", title: "Algorithms", color: "#5b7cfa", day: "Mon", hour: 9, duration: 2, batch: "2025-CSE-A", faculty: "Dr. Chen", room: "R101" },
  { id: "s2", title: "Physics", color: "#f97316", day: "Tue", hour: 10, duration: 1, batch: "2025-CSE-A", faculty: "Prof. Mills", room: "R202" },
  { id: "s3", title: "Databases", color: "#22c55e", day: "Wed", hour: 11, duration: 2, batch: "2025-ECE-A", faculty: "Dr. Díaz", room: "LAB-3" },
];

export default function Timetables() {
  const [items, setItems] = useState<Session[]>(initial);
  const [viewBy, setViewBy] = useState<"batch" | "faculty" | "room">("batch");
  const { toast } = useToast();

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
      </div>
      <TimetableGrid items={items} onChange={setItems} />
    </AppLayout>
  );
}
