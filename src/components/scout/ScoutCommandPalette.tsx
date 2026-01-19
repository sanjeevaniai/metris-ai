import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import { DEMO_PILLARS } from '@/data/demoPillars';
import { DEMO_QUICK_WINS } from '@/data/demoQuickWins';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  History,
  Search,
  Zap,
  Target,
  AlertTriangle,
  TrendingUp,
  Shield,
  Scale,
  BarChart3,
  Download,
  Settings,
  HelpCircle,
  Bot,
  Sparkles,
} from 'lucide-react';

interface ScoutCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// AI-style response generator based on context
function getScoutResponse(query: string, context: {
  score: number;
  pillars: typeof DEMO_PILLARS;
  quickWins: typeof DEMO_QUICK_WINS;
  currentPage: string;
}): string {
  const lowerQuery = query.toLowerCase();
  
  // Score queries
  if (lowerQuery.includes('score') || lowerQuery.includes('how am i')) {
    const lowestPillar = [...context.pillars].sort((a, b) => a.score - b.score)[0];
    return `Your METRIS™ Score is ${context.score}/1000 (Developing Tier). Your biggest challenge is ${lowestPillar.name} at ${lowestPillar.score} points. I'd recommend focusing on fairness documentation first.`;
  }
  
  // Quick wins queries
  if (lowerQuery.includes('quick win') || lowerQuery.includes('fix') || lowerQuery.includes('improve')) {
    const topWin = context.quickWins[0];
    return `Your top quick win is "${topWin.name}" with ${topWin.roi.toFixed(1)}x ROI. It would improve your score by +${topWin.pointGain} points and reduce exposure by $${(topWin.exposureReduction / 1000000).toFixed(1)}M.`;
  }
  
  // Fairness queries
  if (lowerQuery.includes('fairness') || lowerQuery.includes('bias')) {
    const fairness = context.pillars.find(p => p.id === 'fairness');
    return `Your Fairness & Bias score is ${fairness?.score || 534}/1000. This is your lowest pillar. Key issues: missing fairness metrics documentation, incomplete bias testing for protected attributes, and no demographic parity analysis.`;
  }
  
  // EU AI Act queries
  if (lowerQuery.includes('eu') || lowerQuery.includes('ai act') || lowerQuery.includes('regulation')) {
    return `EU AI Act enforcement begins in 199 days. You're currently at 68% compliance. Critical gaps: risk classification documentation, conformity assessment procedure, and human oversight requirements. Priority: Complete Article 9 compliance first.`;
  }
  
  // Exposure queries
  if (lowerQuery.includes('exposure') || lowerQuery.includes('risk') || lowerQuery.includes('money')) {
    return `Total exposure at risk is $12.8M across all pillars. Addressing the top 5 quick wins would reduce this to $4.1M with a $520K investment (16.7x ROI). Payback period: 22 days.`;
  }
  
  // Page context
  if (context.currentPage.includes('checkpoint')) {
    return `You're viewing the Checkpoint Browser. There are 847 checkpoints evaluated, with 47 critical/high findings needing attention. Try filtering by "Fairness" to see the most impactful issues.`;
  }
  
  // Default response
  return `I can help you understand your governance score, find quick wins, check compliance status, or navigate the dashboard. Try asking "What's my score?" or "Show me quick wins."`;
}

export function ScoutCommandPalette({ open, onOpenChange }: ScoutCommandPaletteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  
  const { 
    metrics, 
    setSelectedPillars, 
    addSimulatedFix, 
    setSimulationMode,
    clearAllSelections 
  } = useVisualizationStore();

  // Generate AI response when query changes
  useEffect(() => {
    if (query.length > 3) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        const response = getScoutResponse(query, {
          score: metrics.currentScore,
          pillars: DEMO_PILLARS,
          quickWins: DEMO_QUICK_WINS,
          currentPage: location.pathname,
        });
        setAiResponse(response);
        setIsThinking(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAiResponse(null);
    }
  }, [query, metrics.currentScore, location.pathname]);

  const handleSelect = useCallback((action: string) => {
    onOpenChange(false);
    setQuery('');
    setAiResponse(null);

    switch (action) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'checkpoints':
        navigate('/checkpoints');
        break;
      case 'frameworks':
        navigate('/frameworks');
        break;
      case 'history':
        navigate('/history');
        break;
      case 'show-score':
        navigate('/dashboard');
        break;
      case 'show-fairness':
        setSelectedPillars(['fairness']);
        navigate('/dashboard');
        break;
      case 'show-security':
        setSelectedPillars(['security']);
        navigate('/dashboard');
        break;
      case 'add-top-fix':
        const topFix = DEMO_QUICK_WINS[0];
        addSimulatedFix({
          checkpointId: topFix.checkpointId,
          status: 'pending',
          pointsGain: topFix.pointGain,
          exposureReduction: topFix.exposureReduction,
        });
        setSimulationMode('projected');
        break;
      case 'clear-filters':
        clearAllSelections();
        break;
      case 'export-pdf':
        window.dispatchEvent(new CustomEvent('export-dashboard-pdf'));
        break;
      case 'export-csv':
        window.dispatchEvent(new CustomEvent('export-checkpoints-csv'));
        break;
    }
  }, [navigate, setSelectedPillars, addSimulatedFix, setSimulationMode, clearAllSelections, onOpenChange]);

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Go to Dashboard', shortcut: 'D' },
    { id: 'checkpoints', icon: CheckSquare, label: 'Go to Checkpoints', shortcut: 'C' },
    { id: 'frameworks', icon: FileText, label: 'Go to Frameworks', shortcut: 'F' },
    { id: 'history', icon: History, label: 'Go to Assessment History', shortcut: 'H' },
  ];

  // Quick actions
  const quickActions = [
    { id: 'show-score', icon: Target, label: 'Show my score', badge: `${metrics.currentScore}` },
    { id: 'show-fairness', icon: Scale, label: 'Show Fairness issues', badge: 'Critical' },
    { id: 'show-security', icon: Shield, label: 'Show Security status' },
    { id: 'add-top-fix', icon: Zap, label: 'Add top quick win', badge: '+45 pts' },
    { id: 'clear-filters', icon: AlertTriangle, label: 'Clear all filters' },
  ];

  // Export actions
  const exportActions = [
    { id: 'export-pdf', icon: Download, label: 'Export Dashboard as PDF' },
    { id: 'export-csv', icon: BarChart3, label: 'Export Checkpoints as CSV' },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center gap-2 px-3 border-b border-border">
        <Bot className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-primary">Scout AI</span>
        <Badge variant="secondary" className="text-xs">Beta</Badge>
      </div>
      
      <CommandInput 
        placeholder="Ask Scout anything... (e.g., 'What's my score?')" 
        value={query}
        onValueChange={setQuery}
      />
      
      {/* AI Response Section */}
      <AnimatePresence>
        {(aiResponse || isThinking) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border"
          >
            <div className="px-4 py-3 bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-primary/10 mt-0.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  {isThinking ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="animate-pulse">Scout is thinking...</span>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground leading-relaxed">
                      {aiResponse}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center py-6 text-center">
            <Search className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No results found.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Try asking Scout a question or use one of the actions below.
            </p>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.id}
              onSelect={() => handleSelect(action.id)}
              className="gap-3"
            >
              <action.icon className="h-4 w-4 text-muted-foreground" />
              <span>{action.label}</span>
              {action.badge && (
                <Badge 
                  variant={action.badge === 'Critical' ? 'destructive' : 'secondary'}
                  className="ml-auto text-xs"
                >
                  {action.badge}
                </Badge>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => handleSelect(item.id)}
              className="gap-3"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span>{item.label}</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {item.shortcut}
              </kbd>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Export">
          {exportActions.map((action) => (
            <CommandItem
              key={action.id}
              onSelect={() => handleSelect(action.id)}
              className="gap-3"
            >
              <action.icon className="h-4 w-4 text-muted-foreground" />
              <span>{action.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <div className="border-t border-border p-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↵</kbd> select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">esc</kbd> close
          </span>
        </div>
        <span className="flex items-center gap-1.5">
          <Bot className="h-3 w-3" />
          Powered by SANJEEVANI AI
        </span>
      </div>
    </CommandDialog>
  );
}
