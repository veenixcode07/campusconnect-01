import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryContext";
import { AppProvider } from "@/contexts/AppContext";
import { LoginForm } from "@/components/LoginForm";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Notices } from "@/pages/Notices";
import { Resources } from "@/pages/Resources";
import { Attendance } from "@/pages/Attendance";
import { Assignments } from "@/pages/Assignments";
import { QueryForum } from "@/pages/QueryForum";
import { StudentTracking } from "@/pages/StudentTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <LoginForm />;
  }

  // Always redirect to dashboard after login
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/queries" element={<QueryForum />} />
        <Route path="/tracking" element={<StudentTracking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <QueryProvider>
            <AppProvider>
              <AuthenticatedApp />
            </AppProvider>
          </QueryProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;