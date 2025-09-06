import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Suggestion = {
  id: string;
  from: { day: string; hour: number };
  to: { day: string; hour: number };
  reason: string;
};

export default function ConflictPanel({ suggestions, onApply, onApplyAll }: { suggestions: Suggestion[]; onApply: (s: Suggestion) => void; onApplyAll: () => void }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Conflicts & Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-sm text-muted-foreground">No conflicts detected.</div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.id} className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">Session {s.id}</div>
                  <div className="text-sm text-muted-foreground">Reason: {s.reason}</div>
                  <div className="text-sm text-muted-foreground">From {s.from.day} {s.from.hour}:00 → To {s.to.day} {s.to.hour}:00</div>
                </div>
                <div className="flex-shrink-0 flex flex-col gap-2">
                  <Button size="sm" onClick={() => onApply(s)}>Apply</Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant="secondary" onClick={onApplyAll}>Apply all</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
