import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_FINANCIAL_RISK, formatCurrency } from "@/data/demoFinancialRisk";
import { AlertTriangle, TrendingDown, DollarSign, Shield } from "lucide-react";

export const FinancialRiskCard = () => {
  const { expectedLoss, var95, var99, cvar, auditProbability, fineProbability } = DEMO_FINANCIAL_RISK;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gold" />
          Financial Risk Quantification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Expected Loss</span>
            </div>
            <p className="text-xl font-mono font-medium text-foreground">
              {formatCurrency(expectedLoss)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-risk-high/10 border border-risk-high/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-3.5 w-3.5 text-risk-high" />
              <span className="text-xs text-risk-high">VaR 95%</span>
            </div>
            <p className="text-xl font-mono font-medium text-risk-high">
              {formatCurrency(var95)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-risk-critical/10 border border-risk-critical/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-3.5 w-3.5 text-risk-critical" />
              <span className="text-xs text-risk-critical">VaR 99%</span>
            </div>
            <p className="text-xl font-mono font-medium text-risk-critical">
              {formatCurrency(var99)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">CVaR 95%</span>
            </div>
            <p className="text-xl font-mono font-medium text-foreground">
              {formatCurrency(cvar)}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-mono font-medium text-gold">{(auditProbability * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Audit Probability</p>
          </div>
          <div>
            <p className="text-2xl font-mono font-medium text-risk-high">{(fineProbability * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Fine Probability</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
