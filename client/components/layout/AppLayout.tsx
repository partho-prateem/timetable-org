import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  LayoutGrid,
  PanelsTopLeft,
  Users,
  UsersRound,
} from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/departments", label: "Departments", icon: PanelsTopLeft },
  { to: "/faculties", label: "Faculties", icon: UsersRound },
  { to: "/batches", label: "Batches", icon: GraduationCap },
  { to: "/classrooms", label: "Classrooms", icon: LayoutGrid },
  { to: "/timetables", label: "Timetables", icon: CalendarDays },
  { to: "/compare", label: "Compare", icon: BookOpen },
  { to: "/admin", label: "Admin", icon: Users },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-sky-400" />
            <div className="font-bold">ChronoSlate</div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {(() => {
                  const role = user?.user_metadata?.role ?? user?.app_metadata?.role ?? (user as any)?.role ?? null;
                  return nav
                    .filter((n) => {
                      if (n.to === "/admin") return role === "Admin";
                      return true;
                    })
                    .map((n) => (
                      <SidebarMenuItem key={n.to}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname.startsWith(n.to)}
                        >
                          <NavLink to={n.to} className="flex items-center gap-2">
                            <n.icon className="size-4" />
                            <span>{n.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ));
                })()}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 text-xs text-muted-foreground">
            {user?.email ?? "Guest"}
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
          <div className="font-semibold">Timetable Scheduling Platform</div>
          <div className="ml-auto text-sm text-muted-foreground">
            {user?.email ?? "Not signed in"}
          </div>
        </header>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function PageTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description ? (
        <p className="text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  );
}
