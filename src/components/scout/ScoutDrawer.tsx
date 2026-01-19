import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  X, Send, Loader2, Search, 
  BarChart3, DollarSign, TrendingUp, Target, ClipboardList,
  PlayCircle, FileText, History, Shield, AlertTriangle,
  Settings, Bell, Users, Link, Command,
  ArrowRight, Clock, Sparkles, ChevronRight
} from 'lucide-react';
import { invokeScoutAI } from '@/lib/supabase';
import scoutAvatar from '@/assets/scout-avatar.png';
import { DEMO_SCORE } from '@/data/demoScore';
import { DEMO_REMEDIATION_SUMMARY, DEMO_REMEDIATION_TASKS } from '@/data/demoRemediation';

type PageContext = 
  | 'dashboard'
  | 'assessment_progress'
  | 'assessment_results'
  | 'remediation'
  | 'monitoring'
  | 'checkpoints'
  | 'reports'
  | 'verify'
  | 'settings'
  | 'home';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: ScoutAction[];
  timestamp: Date;
}

interface ScoutAction {
  label: string;
  action: 'navigate' | 'function';
  path?: string;
  variant?: 'default' | 'outline';
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  path?: string;
  action?: () => void;
  category: string;
}

interface Insight {
  id: string;
  type: 'critical' | 'warning' | 'tip';
  title: string;
  description: string;
  impact?: string;
  actionLabel: string;
  actionPath: string;
}

interface ScoutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScoutDrawer({ open, onOpenChange }: ScoutDrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionSearch, setActionSearch] = useState('');
  const [showInsights, setShowInsights] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Demo insights
  const insights: Insight[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Drift detected in DiagnosticAI',
      description: 'PSI: 0.25 > threshold 0.20',
      impact: '-12 pts if not addressed',
      actionLabel: 'View Alert',
      actionPath: '/monitoring',
    },
    {
      id: '2',
      type: 'warning',
      title: 'CP-067 due in 2 days',
      description: 'ISO 42001 renewal at risk',
      actionLabel: 'View Task',
      actionPath: '/remediation',
    },
    {
      id: '3',
      type: 'tip',
      title: 'Fix CP-024 for quick +35 pts',
      description: 'Highest ROI opportunity',
      actionLabel: 'Start Fix',
      actionPath: '/remediation',
    },
  ];

  // Get current page context
  const getPageContext = (): PageContext => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/assess')) return 'assessment_progress';
    if (path.includes('/remediation')) return 'remediation';
    if (path.includes('/monitoring')) return 'monitoring';
    if (path.includes('/checkpoints')) return 'checkpoints';
    if (path.includes('/report')) return 'reports';
    if (path.includes('/verify')) return 'verify';
    if (path.includes('/settings')) return 'settings';
    return 'home';
  };

  const pageContext = getPageContext();

  // Context-aware initial message based on current page
  const getContextMessage = (): { content: string; actions: ScoutAction[] } => {
    const score = DEMO_SCORE.overall;
    const topGap = 'CP-024 bias testing';
    const points = '+35';
    const savings = '$420K';

    switch (pageContext) {
      case 'dashboard':
        return {
          content: `Score: ${score}. Top gap: ${topGap}. Fix for ${points} pts, ${savings} saved.`,
          actions: [
            { label: 'Fix CP-024', action: 'navigate', path: '/remediation' },
            { label: 'View All Gaps', action: 'navigate', path: '/checkpoints', variant: 'outline' },
          ],
        };
      case 'monitoring':
        return {
          content: '3 active alerts. 1 critical: drift in DiagnosticAI (PSI: 0.25). -12 pts impact.',
          actions: [
            { label: 'View Alert', action: 'navigate', path: '/monitoring' },
            { label: 'Fix Drift', action: 'navigate', path: '/remediation' },
          ],
        };
      case 'remediation':
        const tasks = DEMO_REMEDIATION_SUMMARY;
        return {
          content: `${tasks.inProgress} tasks in progress. 3 need attention. CP-067 overdue by 2 days.`,
          actions: [
            { label: 'View CP-067', action: 'navigate', path: '/remediation' },
            { label: 'Reassign', action: 'function', variant: 'outline' },
          ],
        };
      case 'checkpoints':
        return {
          content: 'Viewing 1,915 checkpoints. 28 gaps identified. Filter by framework or search to find specific requirements.',
          actions: [
            { label: 'Show Gaps Only', action: 'function' },
            { label: 'Filter EU AI Act', action: 'function', variant: 'outline' },
          ],
        };
      case 'verify':
        return {
          content: 'Public verification page. Enter EIN or auditor code to verify organization assessments.',
          actions: [
            { label: 'Learn More', action: 'navigate', path: '/features' },
          ],
        };
      default:
        return {
          content: `Score: ${score}. Quick wins available: ${points} pts in 2 weeks. Start with ${topGap}.`,
          actions: [
            { label: 'View Quick Wins', action: 'navigate', path: '/remediation' },
            { label: 'Run Assessment', action: 'navigate', path: '/assess', variant: 'outline' },
          ],
        };
    }
  };

  // Quick actions based on context
  const quickActions: QuickAction[] = [
    { icon: <BarChart3 className="h-4 w-4" />, label: 'View score breakdown', path: '/dashboard', category: 'Common' },
    { icon: <DollarSign className="h-4 w-4" />, label: 'Show financial exposure', path: '/dashboard', category: 'Common' },
    { icon: <TrendingUp className="h-4 w-4" />, label: 'Open forecast', path: '/dashboard', category: 'Common' },
    { icon: <Search className="h-4 w-4" />, label: 'Search checkpoints', path: '/checkpoints', category: 'Common' },
    { icon: <ClipboardList className="h-4 w-4" />, label: 'View my tasks', path: '/remediation', category: 'Common' },
    { icon: <Target className="h-4 w-4" />, label: 'Show quick wins', path: '/remediation', category: 'Common' },
    { icon: <PlayCircle className="h-4 w-4" />, label: 'Start new assessment', path: '/assess', category: 'Assessments' },
    { icon: <History className="h-4 w-4" />, label: 'View assessment history', path: '/dashboard', category: 'Assessments' },
    { icon: <FileText className="h-4 w-4" />, label: 'Generate executive summary', path: '/report', category: 'Reports' },
    { icon: <FileText className="h-4 w-4" />, label: 'Generate board report', path: '/report', category: 'Reports' },
    { icon: <Shield className="h-4 w-4" />, label: 'EU AI Act status', path: '/checkpoints', category: 'Frameworks' },
    { icon: <Shield className="h-4 w-4" />, label: 'ISO 42001 gaps', path: '/checkpoints', category: 'Frameworks' },
    { icon: <Link className="h-4 w-4" />, label: 'Manage integrations', path: '/settings', category: 'Settings' },
    { icon: <Bell className="h-4 w-4" />, label: 'Configure alerts', path: '/settings', category: 'Settings' },
    { icon: <Users className="h-4 w-4" />, label: 'Team settings', path: '/settings', category: 'Settings' },
  ];

  const filteredActions = actionSearch
    ? quickActions.filter(a => a.label.toLowerCase().includes(actionSearch.toLowerCase()))
    : quickActions;

  const groupedActions = filteredActions.reduce((acc, action) => {
    if (!acc[action.category]) acc[action.category] = [];
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, QuickAction[]>);

  // Recent queries (demo)
  const recentQueries = [
    "What's my biggest risk?",
    "How do I fix CP-024?",
    "Show EU AI Act gaps",
  ];

  // Focus input when drawer opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!open) {
      setMessages([]);
      setInput('');
      setActionSearch('');
      setShowInsights(true);
    }
  }, [open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle action click
  const handleAction = (action: ScoutAction | QuickAction) => {
    if ('path' in action && action.path) {
      navigate(action.path);
      onOpenChange(false);
    }
  };

  // Handle send message
  const handleSend = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setShowInsights(false);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Try to call the edge function
      const response = await invokeScoutAI(text, { page: pageContext });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message || response.content || getScoutResponse(text),
        actions: response.actions || getScoutActions(text),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      // Fallback response for demo
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getScoutResponse(text),
        actions: getScoutActions(text),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, pageContext]);

  // Get fallback responses
  const getScoutResponse = (query: string): string => {
    const lower = query.toLowerCase();
    
    if (lower.includes('risk') || lower.includes('biggest')) {
      return 'EU AI Act non-compliance. $3.2M exposure if audited. 4 major gaps in Articles 9, 10, 14. 198 days until enforcement.';
    }
    if (lower.includes('fix') || lower.includes('cp-024')) {
      return 'CP-024 requires bias testing documentation. 4 steps: generate fairness report, write methodology doc, implement monitoring, verify. ~5 hours total. ROI: 168x.';
    }
    if (lower.includes('compare') || lower.includes('industry') || lower.includes('average')) {
      return 'Your score: 743. Healthcare industry avg: 712. You\'re 31 pts above peers. Biggest gap vs industry: human oversight (489 vs 650 avg).';
    }
    if (lower.includes('750') || lower.includes('when')) {
      return 'Current trajectory: ~2 weeks (trending +0.8 pts/day). With quick wins: ~March 15. Fix top 5 items for +98 pts in 3 weeks.';
    }
    if (lower.includes('eu') || lower.includes('ai act')) {
      return '4 major gaps in EU AI Act. Articles 9, 10, 14, 15. $3.2M exposure. 198 days to deadline.';
    }
    
    return "I didn't understand that. Try asking about your score, gaps, risks, or frameworks.";
  };

  const getScoutActions = (query: string): ScoutAction[] => {
    const lower = query.toLowerCase();
    
    if (lower.includes('risk') || lower.includes('biggest')) {
      return [
        { label: 'View EU AI Act Gaps', action: 'navigate', path: '/checkpoints' },
        { label: 'Create Fix Plan', action: 'navigate', path: '/remediation', variant: 'outline' },
      ];
    }
    if (lower.includes('fix') || lower.includes('cp-024')) {
      return [
        { label: 'Start Guided Fix', action: 'navigate', path: '/remediation' },
        { label: 'Download Template', action: 'function', variant: 'outline' },
      ];
    }
    if (lower.includes('compare') || lower.includes('industry')) {
      return [
        { label: 'Improve Human Oversight', action: 'navigate', path: '/remediation' },
        { label: 'Full Benchmark', action: 'navigate', path: '/dashboard', variant: 'outline' },
      ];
    }
    if (lower.includes('750') || lower.includes('when')) {
      return [
        { label: 'View Quick Wins', action: 'navigate', path: '/remediation' },
        { label: 'See Forecast', action: 'navigate', path: '/dashboard', variant: 'outline' },
      ];
    }
    
    return [
      { label: 'View Score', action: 'navigate', path: '/dashboard' },
      { label: 'Show Gaps', action: 'navigate', path: '/checkpoints', variant: 'outline' },
      { label: 'Quick Actions', action: 'function', variant: 'outline' },
    ];
  };

  const contextMessage = getContextMessage();
  const contextLabel = pageContext.charAt(0).toUpperCase() + pageContext.slice(1).replace('_', ' ');

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-background border-l border-border shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <img src={scoutAvatar} alt="Scout" className="w-8 h-8 rounded-full" />
            <span className="font-semibold">Scout</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
              <Command className="h-3 w-3" />K
            </kbd>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Ask Scout anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="pl-10 pr-10"
            />
            {input && (
              <Button 
                size="icon" 
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => handleSend()}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="p-4 space-y-4">
            {/* Insights Panel (when new) */}
            {showInsights && insights.length > 0 && messages.length === 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Scout has {insights.length} insights
                </h3>
                {insights.map((insight) => (
                  <div 
                    key={insight.id} 
                    className={cn(
                      "p-3 rounded-lg border",
                      insight.type === 'critical' && "border-destructive/50 bg-destructive/5",
                      insight.type === 'warning' && "border-yellow-500/50 bg-yellow-500/5",
                      insight.type === 'tip' && "border-primary/50 bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {insight.type === 'critical' && <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />}
                      {insight.type === 'warning' && <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />}
                      {insight.type === 'tip' && <Sparkles className="h-4 w-4 text-primary mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{insight.title}</p>
                        <p className="text-xs text-muted-foreground">{insight.description}</p>
                        {insight.impact && (
                          <p className="text-xs text-destructive mt-1">{insight.impact}</p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="shrink-0 h-7 text-xs"
                        onClick={() => {
                          navigate(insight.actionPath);
                          onOpenChange(false);
                        }}
                      >
                        {insight.actionLabel}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs text-muted-foreground"
                  onClick={() => setShowInsights(false)}
                >
                  Dismiss All
                </Button>
              </div>
            )}

            {/* Context Message (initial state) */}
            {messages.length === 0 && !showInsights && (
              <>
                <div className="space-y-3">
                  <Badge variant="outline" className="text-xs">
                    Context: {contextLabel}
                  </Badge>
                  
                  <div className="flex gap-3">
                    <img src={scoutAvatar} alt="Scout" className="w-10 h-10 rounded-full shrink-0" />
                    <div className="space-y-3">
                      <p className="text-sm">{contextMessage.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {contextMessage.actions.map((action, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant={action.variant || 'default'}
                            onClick={() => handleAction(action)}
                            className="h-8 text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Quick Actions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Quick Actions
                    </h3>
                    <Input
                      placeholder="Search..."
                      value={actionSearch}
                      onChange={(e) => setActionSearch(e.target.value)}
                      className="w-32 h-7 text-xs"
                    />
                  </div>
                  
                  {Object.entries(groupedActions).slice(0, 2).map(([category, actions]) => (
                    <div key={category} className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">{category}</p>
                      {actions.slice(0, 4).map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleAction(action)}
                          className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors text-left"
                        >
                          <span className="text-muted-foreground">{action.icon}</span>
                          <span className="text-sm">{action.label}</span>
                          <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="h-px bg-border" />

                {/* Recent Queries */}
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Recent
                  </h3>
                  {recentQueries.map((query, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(query)}
                      className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors text-left text-sm text-muted-foreground"
                    >
                      <Clock className="h-3 w-3" />
                      "{query}"
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Conversation */}
            {messages.length > 0 && (
              <div className="space-y-4">
                <Badge variant="outline" className="text-xs">
                  Context: {contextLabel}
                </Badge>

                {messages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    {message.role === 'user' ? (
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 max-w-[85%]">
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <img src={scoutAvatar} alt="Scout" className="w-8 h-8 rounded-full shrink-0" />
                        <div className="space-y-2">
                          <p className="text-sm">{message.content}</p>
                          {message.actions && (
                            <div className="flex flex-wrap gap-2">
                              {message.actions.map((action, i) => (
                                <Button
                                  key={i}
                                  size="sm"
                                  variant={action.variant || 'default'}
                                  onClick={() => handleAction(action)}
                                  className="h-7 text-xs"
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <img src={scoutAvatar} alt="Scout" className="w-8 h-8 rounded-full shrink-0 animate-pulse" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Input (when in conversation) */}
        {messages.length > 0 && (
          <div className="p-4 border-t border-border">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
