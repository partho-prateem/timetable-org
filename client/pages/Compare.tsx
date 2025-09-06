import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { TimetableGrid, Session } from "@/components/schedule/TimetableGrid";
import { getTimetable } from "@/lib/api";

export default function Compare() {
  const [search] = useSearchParams();
  const aId = search.get("versionA");
  const bId = search.get("versionB");
  const [left, setLeft] = useState<Session[]>([]);
  const [right, setRight] = useState<Session[]>([]);

  useEffect(() => {
    if (!aId) return;
    getTimetable(aId).then((d) => setLeft(d.items ?? [])).catch(() => setLeft([]));
  }, [aId]);
  useEffect(() => {
    if (!bId) return;
    getTimetable(bId).then((d) => setRight(d.items ?? [])).catch(() => setRight([]));
  }, [bId]);

  const diffIds = useMemo(() => {
    const map = new Map<string, Session>();
    left.forEach((s) => map.set(s.id, s));
    const diffs = new Set<string>();
    right.forEach((s) => {
      const other = map.get(s.id);
      if (!other) diffs.add(s.id);
      else {
        if (other.day !== s.day || other.hour !== s.hour || other.room !== s.room || other.batch !== s.batch || other.faculty !== s.faculty) diffs.add(s.id);
      }
    });
    return diffs;
  }, [left, right]);

  return (
    <AppLayout>
      <PageTitle title="Compare Timetables" description="Side by side comparison of two versions" />
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="font-medium mb-2">A: {aId}</div>
          <TimetableGrid items={left} onChange={setLeft} changedIds={diffIds} />
        </div>
        <div>
          <div className="font-medium mb-2">B: {bId}</div>
          <TimetableGrid items={right} onChange={setRight} changedIds={diffIds} />
        </div>
      </div>
    </AppLayout>
  );
}
