import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, FileText, FileSpreadsheet, FileJson } from "lucide-react";

export type ReportType = "executive" | "comprehensive" | "auditor";
export type OutputFormat = "pdf" | "pdf-excel" | "pdf-json";

export interface ReportConfig {
  reportType: ReportType;
  sections: {
    executiveSummary: boolean;
    scoreBreakdown: boolean;
    financialRisk: boolean;
    frameworkCompliance: boolean;
    remediationRoadmap: boolean;
    forecast: boolean;
    checkpointDetails: boolean;
    evidenceAppendix: boolean;
    methodology: boolean;
    glossary: boolean;
  };
  branding: {
    includeLogo: boolean;
    includeQRCode: boolean;
    whiteLabel: boolean;
  };
  outputFormat: OutputFormat;
}

interface ReportConfigModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (config: ReportConfig) => void;
}

const defaultConfig: ReportConfig = {
  reportType: "comprehensive",
  sections: {
    executiveSummary: true,
    scoreBreakdown: true,
    financialRisk: true,
    frameworkCompliance: true,
    remediationRoadmap: true,
    forecast: true,
    checkpointDetails: false,
    evidenceAppendix: false,
    methodology: false,
    glossary: false,
  },
  branding: {
    includeLogo: true,
    includeQRCode: true,
    whiteLabel: false,
  },
  outputFormat: "pdf",
};

export function ReportConfigModal({ open, onClose, onGenerate }: ReportConfigModalProps) {
  const [config, setConfig] = useState<ReportConfig>(defaultConfig);

  const updateSection = (key: keyof ReportConfig["sections"], value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      sections: { ...prev.sections, [key]: value },
    }));
  };

  const updateBranding = (key: keyof ReportConfig["branding"], value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      branding: { ...prev.branding, [key]: value },
    }));
  };

  const getPageEstimate = () => {
    switch (config.reportType) {
      case "executive":
        return "8-10 pages";
      case "comprehensive":
        return "25-40 pages";
      case "auditor":
        return "50+ pages";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Generate Assessment Report
          </DialogTitle>
          <DialogDescription>
            Configure your PDF report options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Report Type</Label>
            <RadioGroup
              value={config.reportType}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, reportType: value as ReportType }))
              }
              className="space-y-3"
            >
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                <RadioGroupItem value="executive" id="executive" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="executive" className="font-medium cursor-pointer">
                    Executive Summary (8-10 pages)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Score, risk exposure, key gaps, remediation priorities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/50 bg-primary/5 hover:border-primary/70 transition-colors">
                <RadioGroupItem value="comprehensive" id="comprehensive" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="comprehensive" className="font-medium cursor-pointer">
                      Comprehensive Report (25-40 pages)
                    </Label>
                    <Badge className="bg-primary text-xs">RECOMMENDED</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Full checkpoint analysis, framework breakdown, all findings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                <RadioGroupItem value="auditor" id="auditor" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="auditor" className="font-medium cursor-pointer">
                    Auditor Package (50+ pages)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Complete evidence mapping, checkpoint-by-checkpoint detail
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Include Sections */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Include Sections</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "executiveSummary", label: "Executive Summary" },
                { key: "frameworkCompliance", label: "Framework Compliance" },
                { key: "scoreBreakdown", label: "METRIS Score Breakdown" },
                { key: "remediationRoadmap", label: "Remediation Roadmap" },
                { key: "financialRisk", label: "Financial Risk Exposure" },
                { key: "forecast", label: "90-Day Forecast" },
                { key: "checkpointDetails", label: "Full Checkpoint Details" },
                { key: "evidenceAppendix", label: "Evidence Appendix" },
                { key: "methodology", label: "Methodology Explanation" },
                { key: "glossary", label: "Glossary of Terms" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={config.sections[key as keyof ReportConfig["sections"]]}
                    onCheckedChange={(checked) =>
                      updateSection(key as keyof ReportConfig["sections"], !!checked)
                    }
                  />
                  <Label htmlFor={key} className="text-sm cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Branding Options */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Branding Options</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeLogo"
                  checked={config.branding.includeLogo}
                  onCheckedChange={(checked) => updateBranding("includeLogo", !!checked)}
                />
                <Label htmlFor="includeLogo" className="text-sm cursor-pointer">
                  Include company logo (if uploaded)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeQRCode"
                  checked={config.branding.includeQRCode}
                  onCheckedChange={(checked) => updateBranding("includeQRCode", !!checked)}
                />
                <Label htmlFor="includeQRCode" className="text-sm cursor-pointer">
                  Include METRIS verification QR code
                </Label>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <Checkbox id="whiteLabel" disabled />
                <Label htmlFor="whiteLabel" className="text-sm cursor-pointer">
                  White-label (remove METRIS branding)
                </Label>
                <Badge variant="outline" className="text-xs gap-1">
                  <Lock className="h-3 w-3" />
                  Pro
                </Badge>
              </div>
            </div>
          </div>

          {/* Output Format */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Output Format</Label>
            <RadioGroup
              value={config.outputFormat}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, outputFormat: value as OutputFormat }))
              }
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-1 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  PDF
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pdf-excel" id="pdf-excel" />
                <Label htmlFor="pdf-excel" className="flex items-center gap-1 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  PDF + Excel
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pdf-json" id="pdf-json" />
                <Label htmlFor="pdf-json" className="flex items-center gap-1 cursor-pointer">
                  <FileJson className="h-4 w-4" />
                  PDF + JSON
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Estimated: {getPageEstimate()}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onGenerate(config)} className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
