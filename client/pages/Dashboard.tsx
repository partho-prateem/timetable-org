import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  CheckCheck,
  Users,
  LayoutGrid,
  GraduationCap,
  PanelsTopLeft,
} from "lucide-react";

const tiles = [
  {
    to: "/departments",
    title: "Departments",
    icon: PanelsTopLeft,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    to: "/faculties",
    title: "Faculties",
    icon: Users,
    color: "from-sky-500 to-cyan-500",
  },
  {
    to: "/batches",
    title: "Batches",
    icon: GraduationCap,
    color: "from-emerald-500 to-lime-500",
  },
  {
    to: "/classrooms",
    title: "Classrooms",
    icon: LayoutGrid,
    color: "from-amber-500 to-orange-500",
  },
  {
    to: "/timetables",
    title: "Timetables",
    icon: CalendarDays,
    color: "from-indigo-500 to-blue-500",
  },
  {
    to: "/admin",
    title: "Admin",
    icon: CheckCheck,
    color: "from-rose-500 to-pink-500",
  },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <PageTitle
        title="Dashboard"
        description="Manage your scheduling data and timetables"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.to} className="overflow-hidden group">
            <div className={`h-2 bg-gradient-to-r ${t.color}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <t.icon className="size-5 text-muted-foreground" /> {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <NavLink to={t.to}>Open</NavLink>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
