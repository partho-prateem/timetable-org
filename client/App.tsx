import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Faculties from "./pages/Faculties";
import Batches from "./pages/Batches";
import Classrooms from "./pages/Classrooms";
import Timetables from "./pages/Timetables";
import TimetableVersion from "./pages/TimetableVersion";
import Compare from "./pages/Compare";
import Admin from "./pages/Admin";
import Generate from "./pages/Generate";
import FacultyView from "./pages/Faculty";
import StudentView from "./pages/Student";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

function Protected({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, configured, loading } = useAuth();
  if (loading) return null;
  if (configured && !user) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0) {
    const role = user?.user_metadata?.role ?? user?.app_metadata?.role ?? user?.role ?? null;
    if (!role || !roles.includes(role)) return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/departments" element={<Protected><Departments /></Protected>} />
            <Route path="/faculties" element={<Protected><Faculties /></Protected>} />
            <Route path="/batches" element={<Protected><Batches /></Protected>} />
            <Route path="/classrooms" element={<Protected><Classrooms /></Protected>} />
            <Route path="/timetables" element={<Protected><Timetables /></Protected>} />
            <Route path="/timetables/:versionId" element={<Protected><TimetableVersion /></Protected>} />
            <Route path="/timetables/compare" element={<Protected><Compare /></Protected>} />
            <Route path="/compare" element={<Protected><Compare /></Protected>} />
            <Route path="/generate" element={<Protected roles={["Admin","Reviewer"]}><Generate /></Protected>} />
            <Route path="/faculty" element={<Protected roles={["Faculty"]}><FacultyView /></Protected>} />
            <Route path="/student" element={<Protected roles={["Student"]}><StudentView /></Protected>} />
            <Route path="/admin" element={<Protected roles={["Admin"]}><Admin /></Protected>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
