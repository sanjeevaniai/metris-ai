import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, Key, QrCode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { validateEIN, lookupOrganization } from "@/data/demoVerification";
import { PublicHeader } from "@/components/layout/PublicHeader";
import scoutMascot from "@/assets/scout-mascot.png";

type VerificationMethod = "ein" | "code";

export default function Verify() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<VerificationMethod>("ein");
  const [einPart1, setEinPart1] = useState("");
  const [einPart2, setEinPart2] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [auditorCode, setAuditorCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEINVerify = async () => {
    setError(null);
    const ein = `${einPart1}-${einPart2}`;
    
    if (!validateEIN(ein)) {
      setError("Please enter a valid EIN in the format XX-XXXXXXX");
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const org = lookupOrganization(ein);
    if (org) {
      navigate(`/verify/${ein}`);
    } else {
      setError(`No METRIS assessment found for EIN: ${ein}`);
    }
    
    setIsVerifying(false);
  };

  const handleCodeVerify = async () => {
    setError(null);
    
    if (!assessmentId || !auditorCode) {
      setError("Please enter both Assessment ID and Auditor Code");
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, redirect to the demo EIN with auditor code in state
    navigate(`/verify/84-2847591`, { state: { auditorCode: auditorCode.toUpperCase() } });
    setIsVerifying(false);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <img 
            src={scoutMascot} 
            alt="Scout verifying" 
            className="w-32 h-32 mx-auto animate-pulse"
          />
          <h2 className="text-2xl font-bold text-foreground">Verifying Assessment...</h2>
          <div className="w-64 mx-auto">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-[loading_1.5s_ease-in-out_infinite] rounded-full" 
                   style={{ width: '60%' }} />
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <span className="text-primary">🔐</span> Checking cryptographic hash
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-primary">📋</span> Retrieving assessment data
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-primary">✅</span> Validating timestamp
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-2">
      <PublicHeader />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Verify AI Governance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confirm an organization's METRIS assessment authenticity
          </p>
        </div>

        {/* Verification Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              VERIFICATION METHOD
            </h2>

            {/* Method Toggle */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setMethod("ein")}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all text-left",
                  method === "ein"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-foreground">By EIN</span>
                </div>
                <p className="text-sm text-muted-foreground">(Recommended)</p>
                <div className="mt-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    method === "ein" 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground"
                  )} />
                </div>
              </button>

              <button
                onClick={() => setMethod("code")}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all text-left",
                  method === "code"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Key className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-foreground">By Code</span>
                </div>
                <p className="text-sm text-muted-foreground">&nbsp;</p>
                <div className="mt-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    method === "code" 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground"
                  )} />
                </div>
              </button>
            </div>

            <div className="border-t border-border pt-8">
              {method === "ein" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      ENTER EIN (Employer Identification Number)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="84"
                        value={einPart1}
                        onChange={(e) => setEinPart1(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        className="w-24 text-center text-lg font-mono"
                        maxLength={2}
                      />
                      <span className="text-2xl text-muted-foreground">-</span>
                      <Input
                        placeholder="2847591"
                        value={einPart2}
                        onChange={(e) => setEinPart2(e.target.value.replace(/\D/g, '').slice(0, 7))}
                        className="flex-1 text-lg font-mono"
                        maxLength={7}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                    <span className="text-primary">ℹ️</span>
                    <p className="text-sm text-muted-foreground">
                      The EIN is the organization's federal tax identification number and serves as their unique METRIS identifier.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <Button 
                    onClick={handleEINVerify} 
                    className="w-full"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Verify Organization
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      ENTER AUDITOR VERIFICATION CODE
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">
                          Assessment ID
                        </label>
                        <Input
                          placeholder="MTR-2026-0847"
                          value={assessmentId}
                          onChange={(e) => setAssessmentId(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">
                          Auditor Code
                        </label>
                        <Input
                          placeholder="MERIDIAN-2026-GAMMA"
                          value={auditorCode}
                          onChange={(e) => setAuditorCode(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                    <span className="text-primary">ℹ️</span>
                    <p className="text-sm text-muted-foreground">
                      Find these codes on page 1 of the PDF report or in the verification section of the assessment dashboard.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <Button 
                    onClick={handleCodeVerify} 
                    className="w-full"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Verify Assessment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* OR Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 border-t border-border" />
          <span className="text-sm text-muted-foreground">OR</span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* QR Code Scanner */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              SCAN QR CODE FROM REPORT
            </h2>
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                <QrCode className="w-12 h-12 text-muted-foreground" />
                <span className="text-sm text-muted-foreground text-center px-4">
                  Click to enable camera
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            WHAT IS METRIS VERIFICATION?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            METRIS provides cryptographically signed assessments of AI governance. 
            Each assessment is timestamped, hashed, and independently verifiable. 
            Auditors and regulators can confirm assessment authenticity without 
            requiring access to the organization's internal systems.
          </p>
          <Button variant="link" className="p-0 h-auto text-primary">
            Learn More About METRIS
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Demo Helper */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Demo EINs to Try:</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <button 
                onClick={() => { setEinPart1("84"); setEinPart2("2847591"); setMethod("ein"); }}
                className="p-3 rounded-lg bg-background border border-border hover:border-primary/50 text-left transition-all"
              >
                <p className="font-mono text-sm text-foreground">84-2847591</p>
                <p className="text-xs text-muted-foreground">Meridian Health Systems</p>
              </button>
              <button 
                onClick={() => { setEinPart1("12"); setEinPart2("3456789"); setMethod("ein"); }}
                className="p-3 rounded-lg bg-background border border-border hover:border-primary/50 text-left transition-all"
              >
                <p className="font-mono text-sm text-foreground">12-3456789</p>
                <p className="text-xs text-muted-foreground">ACME Corporation</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
