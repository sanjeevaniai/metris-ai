import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  {
    category: 'Navigation',
    items: [
      { keys: ['⌘', 'K'], description: 'Open Scout AI assistant' },
      { keys: ['Escape'], description: 'Clear all selections' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
    ],
  },
  {
    category: 'Dashboard',
    items: [
      { keys: ['D'], description: 'Go to Dashboard' },
      { keys: ['C'], description: 'Go to Checkpoints' },
      { keys: ['F'], description: 'Go to Frameworks' },
      { keys: ['H'], description: 'Go to Assessment History' },
    ],
  },
  {
    category: 'Visualizations',
    items: [
      { keys: ['R'], description: 'Toggle Radar view' },
      { keys: ['G'], description: 'Toggle Grid view' },
      { keys: ['S'], description: 'Toggle Simulation mode' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { keys: ['⌘', 'S'], description: 'Save current simulation' },
      { keys: ['⌘', 'E'], description: 'Export report' },
      { keys: ['⌘', 'Z'], description: 'Undo last action' },
    ],
  },
];

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Keyboard Shortcuts
            <Badge variant="secondary" className="font-mono text-xs">
              Press ? to open
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {SHORTCUTS.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.items.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-sm text-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {index < SHORTCUTS.length - 1 && <Separator className="mt-4" />}
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Escape</kbd> to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Scout AI Placeholder Modal
interface ScoutAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScoutAIModal({ open, onOpenChange }: ScoutAIModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🐕 Scout AI
            <Badge className="bg-primary/20 text-primary border-0">Beta</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl">🐕</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Scout is ready to help!
          </h3>
          <p className="text-muted-foreground text-sm">
            Ask Scout about your governance score, get recommendations for quick wins, or explore your compliance status.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Ask Scout anything..."
            className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Badge variant="outline" className="font-mono text-xs">
              ⌘K
            </Badge>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <p className="text-xs text-muted-foreground">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {['What are my quick wins?', 'Explain my fairness score', 'EU AI Act timeline'].map((q) => (
              <Badge
                key={q}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
              >
                {q}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
