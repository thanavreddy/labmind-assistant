import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import Landing from "./pages/Landing";
import AIAssistant from "./pages/AIAssistant";
import ConceptCheck from "./pages/ConceptCheck";
import LabRecordEditor from "./pages/LabRecordEditor";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeToggle />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/concept-check" element={<ConceptCheck />} />
            <Route path="/lab-record" element={<LabRecordEditor />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/professor" element={<ProfessorDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

