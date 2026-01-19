import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { useChartSync } from '@/hooks/useChartSync';
import { cn } from '@/lib/utils';

interface ClearSelectionsButtonProps {
  className?: string;
  variant?: 'default' | 'compact' | 'banner';
}

export function ClearSelectionsButton({ 
  className, 
  variant = 'default' 
}: ClearSelectionsButtonProps) {
  const { 
    hasSelections, 
    selectionSummary, 
    selectedPillars, 
    selectedFrameworks,
    selectedCheckpoints,
    clearAll 
  } = useChartSync();

  if (!hasSelections) return null;

  if (variant === 'compact') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            className={cn("gap-2", className)}
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (variant === 'banner') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "flex items-center justify-between gap-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">{selectionSummary}</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedPillars.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedPillars.length} pillars
              </Badge>
            )}
            {selectedFrameworks.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedFrameworks.length} frameworks
              </Badge>
            )}
            {selectedCheckpoints.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedCheckpoints.length} checkpoints
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Default variant
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className={cn("flex items-center gap-3", className)}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{selectionSummary}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="h-7 gap-1"
        >
          <X className="h-3 w-3" />
          Clear All
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
