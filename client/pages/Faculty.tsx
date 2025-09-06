import { useEffect, useState } from "react";
import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { TimetableGrid, Session } from "@/components/schedule/TimetableGrid";
import { getTimetable } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export default function FacultyView() {
  const { user } = useAuth();
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // pull a default/current timetable version id from backend or env
        const res = await getTimetable("current");
        const all: Session[] = res.items ?? [];
        // user metadata expected to contain email or faculty id
        const facultyId = user?.email ?? user?.id;
        const my = all.filter(
          (s) => s.faculty && s.faculty.includes(facultyId),
        );
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
      <PageTitle
        title="Faculty Timetable"
        description="Your assigned classes"
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TimetableGrid items={items} onChange={setItems} />
      )}
    </AppLayout>
  );
}
