import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Operator from "./pages/Operator";
import OperatorSettings from "./pages/OperatorSettings";
import Display from "./pages/Display";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import PKManagement from "./pages/PKManagementSimple";
import PKDashboard from "./pages/PKDashboard";
import AdminSetup from "./pages/AdminSetup";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/operator" element={<Operator />} />
          <Route path="/operator-settings" element={<OperatorSettings />} />
          <Route path="/display" element={<Display />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pk-management" element={<PKManagement />} />
          <Route path="/pk-dashboard" element={<PKDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
