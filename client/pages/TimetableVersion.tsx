import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { TimetableGrid, Session } from "@/components/schedule/TimetableGrid";
import { getTimetable, adjustTimetable, getSuggestions } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function TimetableVersion() {
  const { versionId } = useParams();
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!versionId) return;
    setLoading(true);
    getTimetable(versionId)
      .then((data) => {
        // Expect backend to return { items: Session[] }
        setItems(data.items ?? []);
      })
      .catch((e) => toast({ title: "Failed to load timetable", description: e.message ?? String(e), variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [versionId]);

  const onChange = async (updated: Session[]) => {
    setItems(updated);
    if (!versionId) return;
    try {
      await adjustTimetable(versionId, { items: updated });
      toast({ title: "Saved", description: "Timetable adjustments saved." });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message ?? String(e), variant: "destructive" });
    }
  };

  const askAI = async () => {
    try {
      const res = await getSuggestions(items as any[]);
      if (res.updates) {
        const updated = items.map((s) => {
          const u = res.updates.find((x: any) => x.id === s.id);
          return u ? { ...s, day: u.day, hour: u.hour } : s;
        });
        setItems(updated);
        toast({ title: "AI suggestions applied" });
      } else {
        toast({ title: "No suggestions from AI" });
      }
    } catch (e: any) {
      toast({ title: "AI failed", description: e.message ?? String(e), variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <PageTitle title={`Timetable ${versionId ?? ""}`} description="Drag classes to rearrange; changes are saved to the backend." />
      <div className="mb-4 flex gap-3">
        <Button onClick={askAI}>Get AI suggestions</Button>
      </div>
      {loading ? <div>Loading...</div> : <TimetableGrid items={items} onChange={onChange} />}
    </AppLayout>
  );
}
