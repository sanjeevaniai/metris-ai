import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import { DEMO_CHECKPOINTS } from '@/data/demoCheckpoints';
import { DEMO_PILLARS } from '@/data/demoPillars';
import { generateGovernanceReportPDF } from '@/lib/pdfReportGenerator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Download,
  FileText,
  Table,
  Presentation,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  Clock,
  Building2,
  Calendar,
} from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExportType = 'pdf' | 'csv' | 'executive' | 'board';

interface ExportOption {
  id: ExportType;
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  format: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'pdf',
    title: 'Dashboard PDF',
    description: 'Full governance report with all findings, charts, and recommendations',
    icon: FileText,
    format: 'PDF',
  },
  {
    id: 'csv',
    title: 'Checkpoints CSV',
    description: 'All checkpoint data for spreadsheet analysis and custom reporting',
    icon: Table,
    format: 'CSV',
  },
  {
    id: 'executive',
    title: 'Executive Summary',
    description: 'One-page summary for C-suite with key metrics and recommendations',
    icon: FileSpreadsheet,
    badge: 'New',
    format: 'PDF',
  },
  {
    id: 'board',
    title: 'Board Report',
    description: 'Slide-format presentation ready for board meetings',
    icon: Presentation,
    badge: 'Premium',
    format: 'PPTX',
  },
];

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const [selectedExport, setSelectedExport] = useState<ExportType>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const { metrics, organization } = useVisualizationStore();

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      switch (selectedExport) {
        case 'pdf':
          await generateGovernanceReportPDF();
          break;
        case 'csv':
          exportCheckpointsCSV();
          break;
        case 'executive':
          await generateExecutiveSummary();
          break;
        case 'board':
          toast.info('Board Report export is a premium feature. Contact sales for access.');
          break;
      }

      clearInterval(progressInterval);
      setExportProgress(100);
      setExportComplete(true);
      
      toast.success(`${EXPORT_OPTIONS.find(o => o.id === selectedExport)?.title} exported successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [selectedExport]);

  const exportCheckpointsCSV = () => {
    const headers = ['ID', 'Name', 'Pillar', 'Framework', 'Severity', 'Status', 'Score', 'Agent', 'Last Checked'];
    const rows = DEMO_CHECKPOINTS.map(cp => [
      cp.id,
      `"${cp.name}"`,
      cp.pillar,
      cp.framework,
      cp.severity,
      cp.status,
      cp.score,
      cp.agent,
      cp.lastChecked,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metris-checkpoints-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateExecutiveSummary = async () => {
    // For now, use the existing PDF generator with executive focus
    await generateGovernanceReportPDF();
  };

  const resetState = () => {
    setExportComplete(false);
    setExportProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetState();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Reports
          </DialogTitle>
          <DialogDescription>
            Generate and download governance reports in various formats
          </DialogDescription>
        </DialogHeader>

        {!isExporting && !exportComplete ? (
          <div className="space-y-6">
            {/* Report Info */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Organization:</span>
                    <span className="font-medium">{organization.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Score:</span>
                    <span className="font-mono font-bold text-primary">{metrics.currentScore}/1000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <div className="grid grid-cols-2 gap-4">
              {EXPORT_OPTIONS.map((option) => (
                <Card
                  key={option.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    selectedExport === option.id && "border-primary ring-2 ring-primary/20"
                  )}
                  onClick={() => setSelectedExport(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        selectedExport === option.id ? "bg-primary/10" : "bg-muted"
                      )}>
                        <option.icon className={cn(
                          "h-5 w-5",
                          selectedExport === option.id ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{option.title}</h4>
                          {option.badge && (
                            <Badge 
                              variant={option.badge === 'Premium' ? 'secondary' : 'default'}
                              className="text-xs"
                            >
                              {option.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {option.description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {option.format}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Export Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export {EXPORT_OPTIONS.find(o => o.id === selectedExport)?.title}
              </Button>
            </div>
          </div>
        ) : isExporting ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 space-y-6"
          >
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium">Generating Report...</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This may take a few moments
              </p>
            </div>
            <Progress value={exportProgress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {exportProgress}% complete
            </p>
          </motion.div>
        ) : exportComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 space-y-6"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-status-good/10 mb-4">
                <CheckCircle className="h-12 w-12 text-status-good" />
              </div>
              <h3 className="text-lg font-medium">Export Complete!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your report has been downloaded successfully
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => {
                resetState();
              }}>
                Export Another
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          </motion.div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
