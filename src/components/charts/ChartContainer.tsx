import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, BarChart3 } from 'lucide-react';

// Chart Skeleton Component
interface ChartSkeletonProps {
  type?: 'radar' | 'heatmap' | 'network' | 'waterfall' | 'bar' | 'line';
  height?: number;
  className?: string;
}

export function ChartSkeleton({ type = 'bar', height = 300, className }: ChartSkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-4", className)} style={{ minHeight: height }}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Chart area skeleton based on type */}
      {type === 'radar' && (
        <div className="flex items-center justify-center" style={{ height: height - 60 }}>
          <div className="relative">
            <Skeleton className="h-48 w-48 rounded-full opacity-30" />
            <Skeleton className="absolute inset-4 h-40 w-40 rounded-full opacity-20" />
            <Skeleton className="absolute inset-8 h-32 w-32 rounded-full opacity-10" />
          </div>
        </div>
      )}

      {type === 'heatmap' && (
        <div className="grid grid-cols-6 gap-1" style={{ height: height - 60 }}>
          {Array.from({ length: 48 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-8"
              style={{ opacity: 0.2 + Math.random() * 0.4 }}
            />
          ))}
        </div>
      )}

      {type === 'network' && (
        <div className="relative" style={{ height: height - 60 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className="absolute rounded-full"
              style={{
                width: 20 + Math.random() * 30,
                height: 20 + Math.random() * 30,
                left: `${10 + Math.random() * 70}%`,
                top: `${10 + Math.random() * 70}%`,
                opacity: 0.3 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {type === 'waterfall' && (
        <div className="flex items-end gap-2 justify-center" style={{ height: height - 60 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-12"
              style={{ height: `${30 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      )}

      {(type === 'bar' || type === 'line') && (
        <div className="flex items-end gap-2" style={{ height: height - 60 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1"
              style={{ height: `${20 + Math.random() * 70}%` }}
            />
          ))}
        </div>
      )}

      {/* Legend skeleton */}
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// Error Fallback Component
interface ChartErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  height?: number;
}

export function ChartErrorFallback({ 
  error, 
  resetErrorBoundary, 
  title = 'Chart',
  height = 300 
}: ChartErrorFallbackProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center bg-card/50 rounded-lg border border-border/50"
      style={{ minHeight: height }}
    >
      <AlertTriangle className="h-10 w-10 text-status-warning mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        Unable to load {title}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
        {error?.message || 'An error occurred while rendering this chart.'}
      </p>
      {resetErrorBoundary && (
        <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

// Empty State Component
interface ChartEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  height?: number;
}

export function ChartEmptyState({ 
  title = 'No data available',
  description = 'There is no data to display for this chart.',
  icon,
  action,
  height = 300 
}: ChartEmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center bg-card/30 rounded-lg border border-dashed border-border"
      style={{ minHeight: height }}
    >
      {icon || <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />}
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
        {description}
      </p>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

// Error Boundary Class Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  title?: string;
  height?: number;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ChartErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ChartErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          title={this.props.title}
          height={this.props.height}
        />
      );
    }

    return this.props.children;
  }
}

// Animated Chart Wrapper with loading and error handling
interface ChartContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: Error | null;
  skeletonType?: 'radar' | 'heatmap' | 'network' | 'waterfall' | 'bar' | 'line';
  height?: number;
  className?: string;
  headerAction?: React.ReactNode;
  emptyState?: {
    title: string;
    description: string;
    action?: { label: string; onClick: () => void };
  };
  onRetry?: () => void;
}

export function ChartContainer({
  title,
  description,
  children,
  isLoading = false,
  isEmpty = false,
  error = null,
  skeletonType = 'bar',
  height = 300,
  className,
  headerAction,
  emptyState,
  onRetry,
}: ChartContainerProps) {
  return (
    <ChartErrorBoundary title={title} height={height}>
      <Card className={cn("bg-card border-border overflow-hidden", className)}>
        {(title || headerAction) && (
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                {title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
              {headerAction}
            </div>
          </CardHeader>
        )}
        <CardContent className={!title && !headerAction ? 'pt-6' : ''}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChartSkeleton type={skeletonType} height={height} />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ChartErrorFallback
                  error={error}
                  resetErrorBoundary={onRetry}
                  title={title}
                  height={height}
                />
              </motion.div>
            ) : isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ChartEmptyState
                  title={emptyState?.title}
                  description={emptyState?.description}
                  action={emptyState?.action}
                  height={height}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </ChartErrorBoundary>
  );
}

// Animated highlight wrapper for cross-chart selection feedback
interface SelectionHighlightProps {
  children: React.ReactNode;
  isSelected: boolean;
  hasActiveSelection: boolean;
  className?: string;
}

export function SelectionHighlight({
  children,
  isSelected,
  hasActiveSelection,
  className,
}: SelectionHighlightProps) {
  return (
    <motion.div
      animate={{
        opacity: hasActiveSelection ? (isSelected ? 1 : 0.35) : 1,
        scale: isSelected ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "transition-shadow duration-200",
        isSelected && "ring-2 ring-primary shadow-lg shadow-primary/10",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
