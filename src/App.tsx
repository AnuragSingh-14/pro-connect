import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import BookingsPage from "./pages/dashboard/BookingsPage";
import ServicesPage from "./pages/dashboard/ServicesPage";
import CalendarPage from "./pages/dashboard/CalendarPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/bookings" element={<BookingsPage />} />
            <Route path="/dashboard/services" element={<ServicesPage />} />
            <Route path="/dashboard/calendar" element={<CalendarPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/testimonials" element={<DashboardHome />} />
            <Route path="/dashboard/settings" element={<DashboardHome />} />
            <Route path="/dashboard/rewards" element={<DashboardHome />} />
            <Route path="/explore" element={<LandingPage />} />
            <Route path="/:username" element={<PublicProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
