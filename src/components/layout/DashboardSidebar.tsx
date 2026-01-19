import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plus,
  Activity,
  History,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Dices,
  FlaskConical,
  HelpCircle,
  Shield,
  FileSearch,
  AlertTriangle,
  Zap,
  ListOrdered,
  Map,
  FileText,
  Presentation,
  Package,
  Settings,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Cpu,
  Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useVisualizationStore } from "@/store/useVisualizationStore";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavSection {
  name: string;
  icon: React.ElementType;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navSections: NavSection[] = [
  {
    name: "Assessments",
    icon: Activity,
    defaultOpen: true,
    items: [
      { name: "New Assessment", href: "/assess", icon: Plus },
      { name: "Active", href: "/dashboard?filter=active", icon: Activity, badge: "3" },
      { name: "History", href: "/dashboard?filter=history", icon: History },
    ],
  },
  {
    name: "Score Center",
    icon: Target,
    defaultOpen: true,
    items: [
      { name: "Current Score", href: "/dashboard", icon: Target },
      { name: "Score Breakdown", href: "/dashboard#breakdown", icon: BarChart3 },
      { name: "Trend Analysis", href: "/dashboard#trends", icon: TrendingUp },
      { name: "Peer Benchmarks", href: "/dashboard#benchmarks", icon: Users },
    ],
  },
  {
    name: "Human Impact",
    icon: Users,
    defaultOpen: true,
    items: [
      { name: "Traceability", href: "/human-impact", icon: Users },
      { name: "Decision Volume", href: "/human-impact#volume", icon: BarChart3 },
      { name: "Affected Populations", href: "/human-impact#affected", icon: AlertTriangle },
    ],
  },
  {
    name: "Continuous Monitoring",
    icon: Activity,
    items: [
      { name: "Live Dashboard", href: "/monitoring", icon: Activity },
      { name: "Drift Detection", href: "/monitoring#drift", icon: TrendingUp },
      { name: "Alerts & Events", href: "/monitoring#alerts", icon: AlertTriangle },
    ],
  },
  {
    name: "Risk Analysis",
    icon: DollarSign,
    items: [
      { name: "Financial Exposure", href: "/dashboard#exposure", icon: DollarSign },
      { name: "Monte Carlo Results", href: "/simulate", icon: Dices },
      { name: "Scenario Modeling", href: "/simulate#scenarios", icon: FlaskConical },
      { name: "What-If Analysis", href: "/simulate#whatif", icon: HelpCircle },
    ],
  },
  {
    name: "Compliance",
    icon: Shield,
    items: [
      { name: "Framework Coverage", href: "/dashboard#frameworks", icon: Shield },
      { name: "Checkpoint Browser", href: "/checkpoints", icon: FileSearch },
      { name: "Gap Analysis", href: "/dashboard#gaps", icon: AlertTriangle },
    ],
  },
  {
    name: "Remediation",
    icon: Zap,
    items: [
      { name: "Quick Wins (ROI)", href: "/remediation", icon: Zap },
      { name: "Priority Actions", href: "/remediation#priority", icon: ListOrdered },
      { name: "Roadmap Builder", href: "/remediation#roadmap", icon: Map },
    ],
  },
  {
    name: "Reports",
    icon: FileText,
    items: [
      { name: "Executive Summary", href: "/report", icon: FileText },
      { name: "Board Report", href: "/report#board", icon: Presentation },
      { name: "Audit Package", href: "/report#audit", icon: Package },
    ],
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Assessments": true,
    "Score Center": true,
  });
  const location = useLocation();
  const { organization, metrics } = useVisualizationStore();

  const isActive = (path: string) => {
    const basePath = path.split('?')[0].split('#')[0];
    if (basePath === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/";
    }
    return location.pathname === basePath;
  };

  const toggleSection = (sectionName: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const content = (
      <Link to={item.href} className="block">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
            active
              ? "bg-primary/10 text-primary border-l-2 border-primary ml-[-2px]"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.name}</span>
              {item.badge && (
                <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.name}
            {item.badge && (
              <span className="text-xs font-mono text-muted-foreground">
                ({item.badge})
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar flex flex-col z-40 transition-all duration-300 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-[260px]"
      )}
    >
      {/* Header - METRIS Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-[hsl(var(--brand-secondary))] flex items-center justify-center">
              <Cpu className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary tracking-tight">METRIS<sup className="text-[8px] align-super">™</sup></span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" className="mx-auto">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-[hsl(var(--brand-secondary))] flex items-center justify-center">
              <Cpu className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 text-muted-foreground hover:text-foreground",
            collapsed && "absolute -right-3 top-5 bg-background border border-border rounded-full shadow-sm"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {/* Dashboard - Top Level */}
        <Link to="/dashboard" className="block">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-200",
              isActive("/dashboard")
                ? "bg-primary/10 text-primary border-l-2 border-primary ml-[-2px]"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <LayoutDashboard className={cn("h-4 w-4 shrink-0", isActive("/dashboard") && "text-primary")} />
            {!collapsed && <span>Dashboard</span>}
          </div>
        </Link>

        {/* Collapsible Sections */}
        {navSections.map((section) => (
          <Collapsible
            key={section.name}
            open={!collapsed && (openSections[section.name] ?? section.defaultOpen)}
            onOpenChange={() => toggleSection(section.name)}
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200",
                  collapsed && "justify-center"
                )}
              >
                <section.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{section.name}</span>
                    {openSections[section.name] ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </>
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 mt-1 space-y-1">
              {section.items.map((item) => (
                <NavItemComponent key={item.name} item={item} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
        {/* Score Summary (when not collapsed) */}
        {!collapsed && (
          <div className="px-3 py-3 rounded-lg bg-secondary/50 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Current Score</span>
              <span className="text-lg font-mono font-semibold text-primary">{metrics.currentScore}</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-[hsl(var(--brand-secondary))] rounded-full transition-all duration-500" 
                style={{ width: `${(metrics.currentScore / 1000) * 100}%` }} 
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-muted-foreground">{organization.name}</span>
              <span className="text-muted-foreground font-mono">${(metrics.currentExposure / 1000000).toFixed(1)}M exp.</span>
            </div>
          </div>
        )}

        {/* Settings */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link to="/settings" className="block">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all",
                collapsed && "justify-center"
              )}>
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </div>
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Settings</TooltipContent>}
        </Tooltip>

        {/* Scout AI */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button 
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all",
                collapsed && "justify-center"
              )}
            >
              <Sparkles className="h-4 w-4" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Scout AI</span>
                  <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Command className="h-2.5 w-2.5" />K
                  </kbd>
                </>
              )}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Scout AI (⌘K)</TooltipContent>}
        </Tooltip>
      </div>
    </aside>
  );
}
