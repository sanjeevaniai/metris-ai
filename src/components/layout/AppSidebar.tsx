import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Shield, 
  FileCheck, 
  Cpu, 
  LineChart, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  FileText,
  Book,
  Building2,
  Home,
  Users,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DEMO_ORG } from "@/data/demoOrganization";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

const mainNavigation: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Human Impact", href: "/human-impact", icon: Users },
  { name: "Monitoring", href: "/monitoring", icon: Activity },
  { name: "Checkpoints", href: "/checkpoints", icon: FileCheck, badge: "1,768" },
  { name: "Security", href: "/security", icon: Shield },
  { name: "Simulate", href: "/simulate", icon: LineChart },
];

const secondaryNavigation: NavItem[] = [
  { name: "Demo", href: "/intake", icon: Zap },
  { name: "API Docs", href: "/api", icon: FileText },
  { name: "Docs", href: "/docs", icon: Book },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const content = (
      <Link to={item.href} className="block">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-normal transition-all duration-200",
            active
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
        "fixed left-0 top-0 h-screen bg-sidebar-background border-r border-sidebar-border flex flex-col z-40 transition-all duration-300",
        "shadow-[4px_0_30px_-10px_hsl(0_0%_0%/0.4)]",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header - Clickable to go home */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-sm">
              <Cpu className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">METRIS<sup className="text-[6px] align-super">™</sup></span>
              <span className="text-[10px] text-muted-foreground font-mono">v3.2.1</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto group">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-sm">
              <Cpu className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7 text-muted-foreground hover:text-foreground", collapsed && "absolute -right-3 top-5 bg-background border border-border rounded-full shadow-sm")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Organization Context */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{DEMO_ORG.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{DEMO_ORG.ein}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Governance
          </p>
        )}
        {mainNavigation.map((item) => (
          <NavItemComponent key={item.name} item={item} />
        ))}

        <div className="my-4 border-t border-sidebar-border" />

        {!collapsed && (
          <p className="px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Resources
          </p>
        )}
        {secondaryNavigation.map((item) => (
          <NavItemComponent key={item.name} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="px-3 py-2 rounded-md bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">Overall Score</span>
              <span className="text-sm font-mono font-medium text-primary">743</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: "74.3%" }} />
            </div>
          </div>
        )}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link to="/settings" className="block mt-2">
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all",
                collapsed && "justify-center"
              )}>
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </div>
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">Settings</TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}
