import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import scoutMascot from "@/assets/scout-mascot.png";
import type { ReportConfig } from "./ReportConfigModal";

interface GenerationStep {
  id: string;
  label: string;
  status: "pending" | "in-progress" | "complete";
}

interface ReportGenerationProgressProps {
  config: ReportConfig;
  onComplete: (pdfBlob: Blob) => void;
  onError: (error: Error) => void;
}

export function ReportGenerationProgress({
  config,
  onComplete,
  onError,
}: ReportGenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: "cover", label: "Cover page generated", status: "pending" },
    { id: "executive", label: "Executive summary compiled", status: "pending" },
    { id: "score", label: "Score breakdown formatted", status: "pending" },
    { id: "risk", label: "Risk analysis section", status: "pending" },
    { id: "framework", label: "Framework compliance tables", status: "pending" },
    { id: "remediation", label: "Remediation roadmap", status: "pending" },
    { id: "appendices", label: "Appendices", status: "pending" },
    { id: "qr", label: "QR verification code", status: "pending" },
  ]);

  const currentStepLabel = steps[currentStepIndex]?.label || "Finalizing...";

  useEffect(() => {
    const generateReport = async () => {
      try {
        // Simulate step-by-step generation
        for (let i = 0; i < steps.length; i++) {
          setCurrentStepIndex(i);
          setSteps((prev) =>
            prev.map((step, idx) => ({
              ...step,
              status: idx < i ? "complete" : idx === i ? "in-progress" : "pending",
            }))
          );

          // Simulate processing time for each step
          const stepDuration = 400 + Math.random() * 300;
          await new Promise((resolve) => setTimeout(resolve, stepDuration));

          // Update progress
          setProgress(((i + 1) / steps.length) * 100);
        }

        // Mark all steps as complete
        setSteps((prev) => prev.map((step) => ({ ...step, status: "complete" })));

        // Generate the actual PDF
        const { generatePDFReport } = await import("@/lib/pdfReportGenerator");
        const pdfBlob = await generatePDFReport(config);
        
        // Small delay for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        onComplete(pdfBlob);
      } catch (error) {
        onError(error instanceof Error ? error : new Error("Failed to generate report"));
      }
    };

    generateReport();
  }, [config, onComplete, onError]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-lg p-8 text-center">
        {/* Scout Image */}
        <div className="mb-6">
          <img
            src={scoutMascot}
            alt="Scout"
            className="w-32 h-32 mx-auto object-contain drop-shadow-lg animate-pulse"
          />
        </div>

        <h2 className="text-2xl font-bold mb-2">Generating Your Report...</h2>
        <p className="text-muted-foreground mb-6">
          📝 {currentStepLabel}...
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
        </div>

        {/* Steps List */}
        <div className="text-left space-y-2 bg-muted/30 rounded-lg p-4 border border-border/50">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 text-sm transition-opacity ${
                step.status === "pending" ? "opacity-50" : "opacity-100"
              }`}
            >
              {step.status === "complete" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : step.status === "in-progress" ? (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={step.status === "complete" ? "text-emerald-500" : ""}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Estimated time: ~30 seconds
        </p>
      </div>
    </div>
  );
}
