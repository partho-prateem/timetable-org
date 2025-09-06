import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { TimetableGrid, Session } from "@/components/schedule/TimetableGrid";
import { useState } from "react";

const a: Session[] = [
  { id: "a1", title: "Algorithms", color: "#5b7cfa", day: "Mon", hour: 9, duration: 2, batch: "2025-CSE-A", faculty: "Dr. Chen", room: "R101" },
  { id: "a2", title: "Physics", color: "#f97316", day: "Tue", hour: 10, duration: 1, batch: "2025-CSE-A", faculty: "Prof. Mills", room: "R202" },
];
const b: Session[] = [
  { id: "b1", title: "Algorithms", color: "#5b7cfa", day: "Mon", hour: 10, duration: 2, batch: "2025-CSE-A", faculty: "Dr. Chen", room: "R101" },
  { id: "b2", title: "Physics", color: "#f97316", day: "Wed", hour: 9, duration: 1, batch: "2025-CSE-A", faculty: "Prof. Mills", room: "R202" },
];

export default function Compare() {
  const [left, setLeft] = useState(a);
  const [right, setRight] = useState(b);

  return (
    <AppLayout>
      <PageTitle title="Compare Timetables" description="Review schedules side by side" />
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="font-medium mb-2">Current</div>
          <TimetableGrid items={left} onChange={setLeft} />
        </div>
        <div>
          <div className="font-medium mb-2">Proposed</div>
          <TimetableGrid items={right} onChange={setRight} />
        </div>
      </div>
    </AppLayout>
  );
}
