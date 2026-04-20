import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import AddMember from "@/pages/AddMember";
import Members from "@/pages/Members";
import Statistics from "@/pages/Statistics";
import MemberProfile from "@/pages/MemberProfile";
import NotFound from "@/pages/NotFound";
import AddCoach from "./pages/AddCoach";
import CoachDetails from "./pages/CoachDetails";
import Auth from "./pages/Auth";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-member" element={<AddMember />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/:id" element={<MemberProfile />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/coaches" element={<AddCoach />} />
            <Route path="/coaches/:id" element={<CoachDetails />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
