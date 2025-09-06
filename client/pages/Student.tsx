import { useEffect, useState } from "react";
import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { TimetableGrid, Session } from "@/components/schedule/TimetableGrid";
import { getTimetable } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export default function StudentView() {
  const { user } = useAuth();
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getTimetable("current");
        const all: Session[] = res.items ?? [];
        // user metadata expected to contain batch id
        const batchId = user?.user_metadata?.batch ?? user?.email;
        const my = all.filter((s) => s.batch && s.batch.includes(batchId));
        setItems(my);
      } catch (e: any) {
        toast({
          title: "Failed to load timetable",
          description: e.message ?? String(e),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <AppLayout>
      <PageTitle title="My Timetable" description="Your batch's timetable" />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TimetableGrid items={items} onChange={setItems} />
      )}
    </AppLayout>
  );
}
