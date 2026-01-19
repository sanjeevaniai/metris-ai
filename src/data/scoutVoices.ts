export interface ScoutVoice {
  id: 'warm' | 'calm';
  style: string;
  description: string;
  agentId: string;
  accentColor: string;
}

export const SCOUT_VOICES: ScoutVoice[] = [
  {
    id: 'warm',
    style: 'Warm & Engaging',
    description: 'Friendly and conversational tone',
    agentId: 'agent_1601kf2jg5e2ey4r1rgkkya5yebe',
    accentColor: 'from-amber-500/20 to-orange-500/20',
  },
  {
    id: 'calm',
    style: 'Calm & Professional (Eric)',
    description: 'Clear and measured delivery',
    agentId: 'agent_5701kf2jktr9erq8edj9x8ydjjn2',
    accentColor: 'from-blue-500/20 to-cyan-500/20',
  },
];

export function getScoutAgent(voiceId: 'warm' | 'calm'): ScoutVoice {
  return SCOUT_VOICES.find(v => v.id === voiceId) || SCOUT_VOICES[0];
}

export const VOICE_PREVIEWS: Record<string, string> = {
  warm: '/audio/scout-warm-preview.mp3',
  calm: '/audio/scout-calm-preview.mp3',
};
