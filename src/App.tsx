import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Assess from "./pages/Assess";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import ROICalculator from "./pages/ROICalculator";
import Verify from "./pages/Verify";
import VerifyResults from "./pages/VerifyResults";
import Embed from "./pages/Embed";
import Monitoring from "./pages/Monitoring";
import Remediation from "./pages/Remediation";
import CheckpointBrowser from "./pages/CheckpointBrowser";
import FrameworkCoverage from "./pages/FrameworkCoverage";
import AssessmentHistory from "./pages/AssessmentHistory";
import Simulate from "./pages/Simulate";
import Workflow from "./pages/Workflow";
import HumanImpact from "./pages/HumanImpact";
import Integrations from "./pages/Integrations";
import ApiDocs from "./pages/ApiDocs";
import Partners from "./pages/Partners";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assess" element={<Assess />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/roi-calculator" element={<ROICalculator />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/verify/:ein" element={<VerifyResults />} />
          <Route path="/embed" element={<Embed />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/remediation" element={<Remediation />} />
          <Route path="/checkpoints" element={<CheckpointBrowser />} />
          <Route path="/frameworks" element={<FrameworkCoverage />} />
          <Route path="/history" element={<AssessmentHistory />} />
          <Route path="/simulate" element={<Simulate />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/human-impact" element={<HumanImpact />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
