import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  isAnchor?: boolean;
}

const navLinks: NavLink[] = [
  { href: '/workflow', label: 'Workflow', isAnchor: false },
  { href: '/roi-calculator', label: 'ROI Calculator', isAnchor: false },
  { href: '/integrations', label: 'Integrations', isAnchor: false },
  { href: '/dashboard', label: 'Dashboard', isAnchor: false },
  { href: '/verify', label: 'Verify', isAnchor: false },
];

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    return location.pathname === href;
  };

  return (
    <header className="sticky top-2 z-50 border border-border bg-background/95 backdrop-blur-xl mx-2 rounded-lg shadow-[0_4px_30px_-10px_hsl(0_0%_0%/0.5)]">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-glow-sm">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
              METRIS<sup className="text-[8px] align-super">™</sup>
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wide hidden sm:block">
              AI trust you can count.
            </span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            link.isAnchor ? (
              <a 
                key={link.href}
                href={link.href} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link 
                key={link.href}
                to={link.href} 
                className={cn(
                  "text-sm transition-all px-3 py-1.5 rounded-md",
                  isActive(link.href) 
                    ? "text-primary-foreground bg-primary font-medium shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/assess" className="hidden md:block">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-button hover:shadow-button-hover transition-all hover:-translate-y-0.5">
              Start
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background rounded-b-lg">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <a 
                  key={link.href}
                  href={link.href} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-md hover:bg-muted/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link 
                  key={link.href}
                  to={link.href} 
                  className={cn(
                    "text-sm transition-colors py-2 px-3 rounded-md",
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            <Link to="/assess" onClick={() => setMobileMenuOpen(false)} className="mt-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Start
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
