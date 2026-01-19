import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Command, Bell } from 'lucide-react';

interface ScoutTriggerProps {
  insightsCount?: number;
  onClick: () => void;
  className?: string;
}

export function ScoutTrigger({ insightsCount = 0, onClick, className }: ScoutTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 z-40",
        "flex items-center gap-2 px-3 py-2 rounded-full",
        "bg-background/80 backdrop-blur-sm border border-border shadow-lg",
        "hover:bg-muted/80 transition-all duration-200",
        "group",
        className
      )}
    >
      {insightsCount > 0 && (
        <div className="absolute -top-1 -right-1">
          <Badge 
            variant="destructive" 
            className="h-5 w-5 p-0 flex items-center justify-center text-[10px] animate-pulse"
          >
            {insightsCount > 9 ? '9+' : insightsCount}
          </Badge>
        </div>
      )}
      
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">
          <Command className="h-2.5 w-2.5" />
          <span>K</span>
        </kbd>
        <span className="font-medium">Scout</span>
        {insightsCount > 0 && (
          <Bell className="h-3 w-3 text-destructive animate-bounce" />
        )}
      </div>
    </button>
  );
}
