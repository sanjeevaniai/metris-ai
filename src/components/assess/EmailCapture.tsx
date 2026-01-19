import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MessageSquare } from 'lucide-react';
import { VoiceSelectionCard } from './VoiceSelectionCard';
import { SCOUT_VOICES, VOICE_PREVIEWS } from '@/data/scoutVoices';
import type { AssessmentData, VoicePreference } from '@/pages/Assess';

const industries = [
  'Healthcare',
  'Finance',
  'Insurance',
  'Technology',
  'Manufacturing',
  'Retail',
  'Other',
];

interface EmailCaptureProps {
  data: AssessmentData;
  updateData: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
}

export function EmailCapture({ data, updateData, onNext }: EmailCaptureProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlayingVoice, setIsPlayingVoice] = useState<VoicePreference | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!data.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!data.companyName) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!data.industry) {
      newErrors.industry = 'Please select an industry';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVoiceStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      updateData({ mode: 'voice' });
      onNext();
    }
  };

  const handleTextMode = () => {
    if (validate()) {
      updateData({ mode: 'text' });
      onNext();
    }
  };

  const handleVoiceSelect = (voiceId: VoicePreference) => {
    updateData({ voicePreference: voiceId });
  };

  const handleVoicePreview = async (voiceId: VoicePreference) => {
    // Voice preview coming soon - for now just show a brief visual feedback
    setIsPlayingVoice(voiceId);
    
    // Show "playing" state briefly as feedback, then reset
    setTimeout(() => {
      setIsPlayingVoice(null);
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Connect with Scout</h1>
        <p className="text-muted-foreground">
          Your AI governance analyst
        </p>
      </div>

      <form onSubmit={handleVoiceStart} className="card-terminal p-8 rounded-lg space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Your Name <span className="text-destructive">*</span></Label>
          <Input
            id="name"
            type="text"
            placeholder="Sarah Johnson"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            className="bg-background border-border"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Company Field */}
        <div className="space-y-2">
          <Label htmlFor="company">Company Name <span className="text-destructive">*</span></Label>
          <Input
            id="company"
            type="text"
            placeholder="Acme Corp"
            value={data.companyName}
            onChange={(e) => updateData({ companyName: e.target.value })}
            className="bg-background border-border"
          />
          {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Work Email <span className="text-destructive">*</span></Label>
          <Input
            id="email"
            type="email"
            placeholder="sarah@acme.com"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="bg-background border-border"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        {/* Industry Field */}
        <div className="space-y-2">
          <Label htmlFor="industry">Industry <span className="text-destructive">*</span></Label>
          <Select 
            value={data.industry} 
            onValueChange={(value) => updateData({ industry: value })}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Voice Selection */}
        <div className="space-y-3">
          <div className="text-center">
            <Label className="text-base">Choose Scout's Voice</Label>
            <p className="text-xs text-muted-foreground mt-1">Same Scout, different style</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {SCOUT_VOICES.map((voice) => (
              <VoiceSelectionCard
                key={voice.id}
                voice={voice}
                isSelected={data.voicePreference === voice.id}
                onSelect={(id) => handleVoiceSelect(id as VoicePreference)}
                onPreview={(id) => handleVoicePreview(id as VoicePreference)}
                isPlaying={isPlayingVoice === voice.id}
              />
            ))}
          </div>
        </div>

        {/* Start Voice Conversation Button */}
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg"
        >
          <Mic className="mr-2 h-5 w-5" />
          Start Conversation
        </Button>

        {/* Text Mode Option */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleTextMode}
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            Prefer typing?
            <span className="text-primary font-medium inline-flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Text mode
            </span>
          </button>
        </div>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-6">
        By continuing, you agree to receive your results and occasional updates from SANJEEVANI AI.
      </p>
    </div>
  );
}
