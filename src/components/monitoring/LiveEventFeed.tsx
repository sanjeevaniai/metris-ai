import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Radio, Filter, Pause, Play, ChevronDown } from 'lucide-react';
import { DEMO_LIVE_EVENTS, LiveEvent } from '@/data/demoMonitoring';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  });
}

const typeConfig = {
  success: { icon: '🟢', color: 'text-risk-low' },
  error: { icon: '🔴', color: 'text-risk-critical' },
  warning: { icon: '🟡', color: 'text-risk-medium' },
  info: { icon: '🔵', color: 'text-primary' },
};

function EventItem({ event }: { event: LiveEvent }) {
  const config = typeConfig[event.type];

  return (
    <div className="py-3 border-b border-border/30 last:border-0">
      <div className="flex items-start gap-3">
        <span>{config.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground font-mono">{formatTime(event.timestamp)}</span>
            <span className={`font-medium text-sm ${config.color}`}>{event.title}</span>
          </div>
          <div className="space-y-0.5">
            {event.details.map((detail, index) => (
              <p key={index} className="text-xs text-muted-foreground">{detail}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LiveEventFeed() {
  const [isPaused, setIsPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedEvents = showAll ? DEMO_LIVE_EVENTS : DEMO_LIVE_EVENTS.slice(0, 4);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-light flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary animate-pulse" />
            Live Event Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto">
          {displayedEvents.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
        
        {!showAll && DEMO_LIVE_EVENTS.length > 4 && (
          <Button 
            variant="ghost" 
            className="w-full mt-3 text-xs text-primary"
            onClick={() => setShowAll(true)}
          >
            Load More Events
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
