import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, Zap, Book, GitBranch } from 'lucide-react';

const navigation = [
  { name: 'Demo', href: '/', icon: Zap },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Workflow', href: '/workflow', icon: GitBranch },
  { name: 'API Docs', href: '/api', icon: FileText },
  { name: 'Navigation Docs', href: '/docs', icon: Book },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - Cyan text like SANJEEVANI brand exactly */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-primary/15 rounded-lg" />
            <div className="absolute inset-0.5 bg-background rounded-lg flex items-center justify-center border border-primary/25">
              <span className="text-secondary font-light text-lg">S</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-display font-light tracking-widest text-secondary">
              SANJEEVANI AI
            </span>
            <span className="text-[10px] font-display text-muted-foreground font-light tracking-wide">
              METRIS Platform
            </span>
          </div>
        </Link>

        {/* Navigation - Dark pill buttons like landing page */}
        <nav className="hidden md:flex items-center gap-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'gap-2 rounded-md px-4 py-2 font-light text-sm border transition-all',
                    isActive 
                      ? 'bg-muted border-border text-foreground' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border/50'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* CTA - Bright emerald button like landing page */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline text-xs text-muted-foreground font-light tracking-wide">
            Risk to ROI at Every Stage
          </span>
          <Button 
            size="sm" 
            className="rounded-md px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-light text-sm"
            onClick={() => window.open('https://calendar.notion.so/meet/siaai/0619', '_blank')}
          >
            Book Demo
          </Button>
        </div>
      </div>
    </header>
  );
}
