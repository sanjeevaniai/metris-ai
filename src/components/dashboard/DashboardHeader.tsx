// CARFAX-style Dashboard Header with System Selector
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import { 
  ChevronRight, 
  Cpu, 
  Calendar, 
  FileCheck,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const navigate = useNavigate();
  const { selectedSystem, organization, metrics } = useVisualizationStore();
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-4">
      {/* Blue Gradient Header Bar */}
      <div className="rounded-lg bg-gradient-to-r from-[#0066cc] to-[#0052a3] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Your AI Governance Dashboard</h1>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{currentDate}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs uppercase tracking-wider">Organization</p>
            <p className="text-white font-medium">{organization.name}</p>
          </div>
        </div>
      </div>

      {/* Powered by SANJEEVANI band */}
      <div className="rounded-lg bg-[#004080] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">Powered by</span>
          <span className="text-white font-semibold tracking-wider">SANJEEVANI AI</span>
        </div>
        <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
          Enterprise
        </Badge>
      </div>

      {/* System Selector Card */}
      {selectedSystem && (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                  <Cpu className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedSystem.name}</h2>
                  <p className="text-muted-foreground text-sm">
                    {selectedSystem.type} • {selectedSystem.riskLevel} • {selectedSystem.status}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                    <FileCheck className="h-4 w-4" />
                    <span className="font-mono">847 Checkpoints Evaluated</span>
                  </div>
                </div>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                onClick={() => navigate('/assess')}
              >
                View Assessment Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Banner */}
      <div className="rounded-lg bg-[hsl(var(--brand-secondary)/0.1)] border border-[hsl(var(--brand-secondary)/0.2)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-[hsl(var(--brand-secondary))]" />
          <p className="text-foreground text-sm">
            <span className="font-medium">Did you know?</span> Your assessment history is included in your METRIS Report
          </p>
        </div>
        <Button 
          variant="link" 
          className="text-primary p-0 h-auto font-medium"
          onClick={() => navigate('/report')}
        >
          Review Full Assessment
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
