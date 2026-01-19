import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Shield, CheckCircle2, Copy, ExternalLink, Download, 
  TrendingUp, TrendingDown, AlertTriangle, FileText, 
  Lock, Eye, ChevronDown, ChevronUp, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { lookupOrganization, validateAuditorCode, VerifiedOrganization } from "@/data/demoVerification";
import scoutMascot from "@/assets/scout-mascot.png";
import { useToast } from "@/hooks/use-toast";

export default function VerifyResults() {
  const { ein } = useParams<{ ein: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [org, setOrg] = useState<VerifiedOrganization | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditorCode, setAuditorCode] = useState("");
  const [auditorAccess, setAuditorAccess] = useState<{
    granted: boolean;
    validUntil?: string;
    issuedTo?: string;
  }>({ granted: false });
  const [showAllGaps, setShowAllGaps] = useState(false);
  const [auditorError, setAuditorError] = useState<string | null>(null);

  useEffect(() => {
    if (ein) {
      const organization = lookupOrganization(ein);
      setOrg(organization);
      setLoading(false);

      // Check for auditor code passed via navigation state
      const stateCode = (location.state as { auditorCode?: string })?.auditorCode;
      if (stateCode) {
        const result = validateAuditorCode(stateCode);
        if (result.valid && result.ein === ein) {
          setAuditorAccess({
            granted: true,
            validUntil: result.validUntil,
            issuedTo: result.issuedTo,
          });
        }
      }
    }
  }, [ein, location.state]);

  const handleAuditorAccess = () => {
    setAuditorError(null);
    const result = validateAuditorCode(auditorCode);
    
    if (result.valid && result.ein === ein) {
      setAuditorAccess({
        granted: true,
        validUntil: result.validUntil,
        issuedTo: result.issuedTo,
      });
      toast({
        title: "Auditor Access Granted",
        description: "You now have access to the full assessment details.",
      });
    } else {
      setAuditorError("Invalid auditor code for this assessment");
    }
  };

  const copyHash = () => {
    if (org) {
      navigator.clipboard.writeText(org.verification.documentHash);
      toast({
        title: "Hash Copied",
        description: "Document hash copied to clipboard",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 850) return "text-green-500";
    if (score >= 750) return "text-emerald-500";
    if (score >= 600) return "text-yellow-500";
    if (score >= 400) return "text-orange-500";
    return "text-red-500";
  };

  const getScorePosition = (score: number) => {
    return Math.min(Math.max((score / 1000) * 100, 0), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">METRIS<sup className="text-[10px] align-super">™</sup></span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/verify")}>
              New Lookup
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <img 
            src={scoutMascot} 
            alt="Scout" 
            className="w-24 h-24 mx-auto mb-6 opacity-50"
          />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            ❌ Organization Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            No METRIS assessment found for EIN: <span className="font-mono">{ein}</span>
          </p>
          
          <Card className="mb-8">
            <CardContent className="p-6 text-left">
              <p className="text-sm text-muted-foreground mb-4">This could mean:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• The organization hasn't completed a METRIS assessment</li>
                <li>• The EIN was entered incorrectly</li>
                <li>• The organization uses a different identifier</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/verify")}>
              Try Another EIN
            </Button>
            <Button variant="outline" onClick={() => navigate("/assess")}>
              Request a METRIS Assessment
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">METRIS</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/verify")}>
            New Lookup
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Verified Banner */}
        <Card className="mb-8 bg-green-500/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <h2 className="text-xl font-bold text-green-500">VERIFIED ASSESSMENT</h2>
                <p className="text-sm text-muted-foreground">
                  This assessment has been cryptographically verified as authentic and unmodified since issuance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Identity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">ORGANIZATION IDENTITY</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="text-lg font-semibold text-foreground">{org.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">EIN</p>
                <p className="text-lg font-mono text-foreground">{org.ein}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="text-foreground">{org.industry}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jurisdictions</p>
                <div className="flex gap-2">
                  {org.jurisdictions.map((j) => (
                    <Badge key={j.code} variant="secondary">
                      {j.flag} {j.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">METRIS Verified Since</p>
                <p className="text-foreground">{org.verifiedSince}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assessments</p>
                <p className="text-foreground">{org.totalAssessments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current METRIS Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">CURRENT METRIS SCORE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-6">
              <img src={scoutMascot} alt="Scout Badge" className="w-16 h-16 mb-4" />
              
              <div className="text-center mb-6">
                <div className={cn("text-6xl font-bold", getScoreColor(org.currentScore.value))}>
                  {org.currentScore.value}
                </div>
                <div className="text-xl text-muted-foreground">
                  ± {org.currentScore.confidence}
                </div>
                <div className={cn(
                  "text-lg font-semibold mt-2",
                  org.currentScore.status === "pass" ? "text-green-500" : "text-yellow-500"
                )}>
                  {org.currentScore.statusLabel}
                </div>
              </div>

              {/* Score Scale */}
              <div className="w-full max-w-lg mb-6">
                <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
                  <div 
                    className="absolute top-0 w-1 h-full bg-white shadow-lg transform -translate-x-1/2"
                    style={{ left: `${getScorePosition(org.currentScore.value)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0</span>
                  <span>MINIMAL</span>
                  <span>CRITICAL</span>
                  <span>WEAK</span>
                  <span>MODERATE</span>
                  <span>STRONG</span>
                  <span>1000</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 text-center text-sm">
                <div>
                  <p className="text-muted-foreground">Confidence Level</p>
                  <p className="font-semibold text-foreground">{org.currentScore.confidenceLevel}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Assessment</p>
                  <p className="font-semibold text-foreground">{org.currentScore.lastAssessment}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valid Until</p>
                  <p className="font-semibold text-foreground">{org.currentScore.validUntil}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">SCORE HISTORY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {org.scoreHistory.map((entry, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    idx === 0 ? "bg-primary/10" : "bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{entry.date}</span>
                    <span className={cn("text-lg font-bold", getScoreColor(entry.score))}>
                      {entry.score}
                    </span>
                    <span className="text-sm text-muted-foreground">(±{entry.confidence})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.change !== undefined && (
                      <span className={cn(
                        "flex items-center text-sm",
                        entry.change > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {entry.change > 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(entry.change)} points
                      </span>
                    )}
                    {entry.label && (
                      <Badge variant="secondary">{entry.label}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Framework Compliance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">FRAMEWORK COMPLIANCE SUMMARY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Framework</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {org.frameworks.map((fw, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="py-3 px-2">
                        <span className="mr-2">{fw.icon}</span>
                        {fw.name}
                      </td>
                      <td className={cn("py-3 px-2 font-mono", getScoreColor(fw.score))}>
                        {fw.score}
                      </td>
                      <td className="py-3 px-2">
                        {fw.status === "pass" ? (
                          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                            ✅ Pass
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                            ⚠️ Gaps
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {fw.deadline || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Overall Coverage: 1,887 of 1,915 checkpoints passing (98.5%)
            </p>
          </CardContent>
        </Card>

        {/* Financial Risk Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">FINANCIAL RISK SUMMARY (Public View)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Risk Exposure Range</p>
                <p className="text-lg font-semibold text-foreground">
                  {org.financialRisk.rangeMin} - {org.financialRisk.rangeMax}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Expected Loss</p>
                <p className="text-lg font-semibold text-foreground">{org.financialRisk.expectedLoss}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">VaR (95%)</p>
                <p className="text-lg font-semibold text-foreground">{org.financialRisk.var95}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Note: Detailed financial breakdown available to authorized parties with auditor code access.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cryptographic Verification */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">CRYPTOGRAPHIC VERIFICATION</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Assessment ID</p>
                <p className="font-mono text-foreground">{org.verification.assessmentId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Issued</p>
                <p className="text-foreground">{org.verification.issued}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Document Hash ({org.verification.hashAlgorithm})</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 rounded-lg bg-muted font-mono text-xs break-all">
                  {org.verification.documentHash}
                </code>
                <Button variant="outline" size="sm" onClick={copyHash}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Hash matches on-chain record</span>
              </div>
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Timestamp verified via RFC 3161</span>
              </div>
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">No modifications detected since issuance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auditor Access Section */}
        {!auditorAccess.granted ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5" />
                FOR AUDITORS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Need detailed access? Enter your auditor code:
              </p>
              <div className="flex gap-3 mb-4">
                <Input
                  placeholder="Enter auditor code..."
                  value={auditorCode}
                  onChange={(e) => setAuditorCode(e.target.value)}
                  className="flex-1 font-mono"
                />
                <Button onClick={handleAuditorAccess}>
                  <Lock className="w-4 h-4 mr-2" />
                  Access Full Report
                </Button>
              </div>
              
              {auditorError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                  <p className="text-sm text-destructive">{auditorError}</p>
                </div>
              )}

              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium">Auditor access includes:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Complete gap analysis with checkpoint details</li>
                  <li>Full evidence mapping</li>
                  <li>Detailed financial risk breakdown</li>
                  <li>Methodology documentation</li>
                  <li>Downloadable audit package</li>
                </ul>
              </div>

              {/* Demo helper */}
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-2">Demo auditor code:</p>
                <button
                  onClick={() => setAuditorCode("MERIDIAN-2026-GAMMA")}
                  className="font-mono text-sm text-primary hover:underline"
                >
                  MERIDIAN-2026-GAMMA
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Auditor Access Granted Banner */}
            <Card className="mb-8 bg-primary/10 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-primary">AUDITOR ACCESS GRANTED</h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Auditor Code</p>
                    <p className="font-mono text-foreground">{auditorCode.toUpperCase() || "MERIDIAN-2026-GAMMA"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Access Level</p>
                    <p className="text-foreground">Full Report Access</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valid Until</p>
                    <p className="text-foreground">{auditorAccess.validUntil}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complete Gap Analysis */}
            {org.gaps && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">COMPLETE GAP ANALYSIS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                      <p className="text-2xl font-bold text-red-500">{org.gaps.major.count}</p>
                      <p className="text-sm text-muted-foreground">🔴 Major</p>
                      <p className="text-sm font-semibold text-foreground">{org.gaps.major.impact}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
                      <p className="text-2xl font-bold text-yellow-500">{org.gaps.minor.count}</p>
                      <p className="text-sm text-muted-foreground">🟡 Minor</p>
                      <p className="text-sm font-semibold text-foreground">{org.gaps.minor.impact}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                      <p className="text-2xl font-bold text-blue-500">{org.gaps.ofi.count}</p>
                      <p className="text-sm text-muted-foreground">🔵 OFI</p>
                      <p className="text-sm font-semibold text-foreground">{org.gaps.ofi.impact}</p>
                    </div>
                  </div>

                  {/* Major Gaps Detail */}
                  {org.majorGaps && org.majorGaps.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">MAJOR GAPS (Auditor Detail)</h3>
                      {org.majorGaps.slice(0, showAllGaps ? undefined : 3).map((gap) => (
                        <div key={gap.id} className="p-4 rounded-lg border border-border">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="font-mono text-sm text-muted-foreground">{gap.checkpoint}</span>
                              <h4 className="font-semibold text-foreground">{gap.title}</h4>
                            </div>
                            <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                              {gap.riskImpact}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Framework: {gap.framework}
                          </p>
                          <div className="grid sm:grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Finding</p>
                              <p className="text-foreground">{gap.finding}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Evidence Gap</p>
                              <p className="text-foreground">{gap.evidenceGap}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Remediation</p>
                              <p className="text-foreground">{gap.remediation}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              View Evidence
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="w-3 h-3 mr-1" />
                              Checkpoint Detail
                            </Button>
                          </div>
                        </div>
                      ))}

                      {org.majorGaps.length > 3 && (
                        <Button 
                          variant="ghost" 
                          onClick={() => setShowAllGaps(!showAllGaps)}
                          className="w-full"
                        >
                          {showAllGaps ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Show all {org.majorGaps.length} major gaps
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Evidence Inventory */}
            {org.evidenceInventory && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">EVIDENCE INVENTORY</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Source</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Checkpoints</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Coverage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {org.evidenceInventory.map((evidence, idx) => (
                          <tr key={idx} className="border-b border-border/50">
                            <td className="py-3 px-2 font-mono text-sm">{evidence.source}</td>
                            <td className="py-3 px-2">
                              <Badge variant="secondary">{evidence.type}</Badge>
                            </td>
                            <td className="py-3 px-2">{evidence.checkpoints}</td>
                            <td className="py-3 px-2">{evidence.coverage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Total Evidence Sources: {org.evidenceInventory.length} • 
                    Total Checkpoints Covered: 428 of 487 requiring evidence (87.9%)
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Download Options */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">DOWNLOAD OPTIONS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    Full PDF Report
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Excel Data Export
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Complete Audit Package
                  </Button>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Audit Package includes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Full assessment report (PDF)</li>
                    <li>Checkpoint-by-checkpoint findings (Excel)</li>
                    <li>Evidence mapping matrix (Excel)</li>
                    <li>Methodology documentation (PDF)</li>
                    <li>Raw assessment data (JSON)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="outline" onClick={() => navigate("/verify")}>
            <Home className="w-4 h-4 mr-2" />
            Return to Verify
          </Button>
          <Button onClick={() => navigate("/assess")}>
            Request Assessment for Your Org
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
          <p>
            Assessment conducted by METRIS v3.0 • 25 AI Agents • 1,915 Checkpoints
          </p>
          <p className="mt-1">
            Methodology: Bayesian scoring with Monte Carlo risk simulation
          </p>
          <Button variant="link" className="text-primary p-0 h-auto mt-2">
            Learn about METRIS methodology →
          </Button>
        </div>
      </main>
    </div>
  );
}
