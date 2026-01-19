import { cn } from '@/lib/utils';
import { Check, Play, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ScoutVoice } from '@/data/scoutVoices';
import scoutAvatarWarm from '@/assets/scout-avatar-warm.png';
import scoutAvatarCalm from '@/assets/scout-avatar-calm.png';

const avatarImages: Record<string, string> = {
  warm: scoutAvatarWarm,
  calm: scoutAvatarCalm,
};

interface VoiceSelectionCardProps {
  voice: ScoutVoice;
  isSelected: boolean;
  onSelect: (voiceId: 'warm' | 'calm') => void;
  onPreview: (voiceId: 'warm' | 'calm') => void;
  isPlaying: boolean;
}

export function VoiceSelectionCard({ 
  voice, 
  isSelected, 
  onSelect, 
  onPreview, 
  isPlaying 
}: VoiceSelectionCardProps) {
  return (
    <div
      onClick={() => onSelect(voice.id)}
      className={cn(
        "relative flex flex-col items-center p-6 rounded-xl cursor-pointer transition-all duration-200",
        "border-2 bg-card hover:bg-accent/50",
        isSelected 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50"
      )}
    >
      {/* Avatar Image */}
      <div 
        className={cn(
          "w-20 h-20 rounded-full overflow-hidden mb-4 ring-4",
          voice.id === 'warm' ? "ring-amber-500/30" : "ring-blue-500/30",
          isPlaying && "animate-pulse"
        )}
      >
        <img 
          src={avatarImages[voice.id]} 
          alt={`${voice.style} voice avatar`}
          className="w-full h-full object-cover"
        />
      </div>
      
      
      {/* Preview Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onPreview(voice.id);
        }}
        className="text-primary hover:text-primary/80"
        disabled={isPlaying}
      >
        {isPlaying ? (
          <>
            <Volume2 className="mr-2 h-4 w-4 animate-pulse" />
            Playing...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Preview
          </>
        )}
      </Button>
      
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
