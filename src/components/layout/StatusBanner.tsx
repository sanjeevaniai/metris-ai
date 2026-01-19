import { useState } from 'react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatusBannerConfig {
  message: string;
  type?: 'warning' | 'error' | 'info';
  linkText?: string;
  linkUrl?: string;
  dismissible?: boolean;
}

interface StatusBannerProps {
  config: StatusBannerConfig | null;
  onDismiss?: () => void;
}

export function StatusBanner({ config, onDismiss }: StatusBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!config || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const typeStyles = {
    warning: 'bg-amber-500 text-amber-950',
    error: 'bg-destructive text-destructive-foreground',
    info: 'bg-primary text-primary-foreground',
  };

  const type = config.type || 'warning';

  return (
    <div className={cn(
      'w-full px-4 py-2 flex items-center justify-center gap-3 text-sm font-medium relative z-50',
      typeStyles[type]
    )}>
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <span>{config.message}</span>
      {config.linkText && config.linkUrl && (
        <a
          href={config.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {config.linkText}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {config.dismissible !== false && (
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Hook to manage status banner state globally
import { create } from 'zustand';

interface StatusBannerStore {
  config: StatusBannerConfig | null;
  showBanner: (config: StatusBannerConfig) => void;
  hideBanner: () => void;
}

export const useStatusBanner = create<StatusBannerStore>((set) => ({
  config: null,
  showBanner: (config) => set({ config }),
  hideBanner: () => set({ config: null }),
}));
