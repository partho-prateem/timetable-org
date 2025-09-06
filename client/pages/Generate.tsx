import { useState } from "react";
import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { runTimetable, approveTimetable } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Generate() {
  const [running, setRunning] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const { toast } = useToast();

  const run = async () => {
    setRunning(true);
    try {
      const res = await runTimetable({ params: {} });
      // expect { candidates: [{ id, items }] }
      setCandidates(res.candidates ?? []);
      toast({ title: "Generation finished", description: `${(res.candidates ?? []).length} candidates returned` });
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message ?? String(e), variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const approve = async (versionId: string, selectionId: string) => {
    try {
      await approveTimetable(versionId, selectionId);
      toast({ title: "Approved", description: "Selection approved." });
    } catch (e: any) {
      toast({ title: "Approve failed", description: e.message ?? String(e), variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <PageTitle title="Generate Timetables" description="Run generator and preview candidate timetable versions." />
      <div className="mb-4">
        <Button onClick={run} disabled={running}>{running ? "Running..." : "Run generator"}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {candidates.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>Candidate {c.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">Score: {c.score ?? "-"}</div>
              <div className="max-h-48 overflow-auto mb-2">
                {/* render a textual preview of items */}
                <pre className="text-xs">{JSON.stringify(c.items?.slice(0, 20) ?? [], null, 2)}</pre>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => approve(c.versionId ?? c.id, c.id)}>Approve</Button>
                <Button variant="secondary" asChild>
                  <a href={`/timetables/${c.versionId ?? c.id}`}>Open</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
