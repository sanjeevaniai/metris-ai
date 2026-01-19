import { useRef, useCallback } from 'react';

export function useAnalysisSounds() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  // Subtle beep for pass findings (higher, pleasant tone)
  const playPassBeep = useCallback(() => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }, [getAudioContext]);

  // Warning beep for gap findings (lower, attention-getting)
  const playGapBeep = useCallback((isMajor: boolean) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'triangle';
    // Major gaps get lower tone, minor gaps slightly higher
    oscillator.frequency.setValueAtTime(isMajor ? 330 : 440, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(isMajor ? 0.12 : 0.08, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [getAudioContext]);

  // Info beep for OFI findings (soft, informational)
  const playOfiBeep = useCallback(() => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, ctx.currentTime); // E5 note
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.12);
  }, [getAudioContext]);

  // Agent complete sound (short ascending arpeggio)
  const playAgentComplete = useCallback(() => {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * 0.08;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, startTime + 0.15);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    });
  }, [getAudioContext]);

  // Completion chime (triumphant chord with reverb-like decay)
  const playCompletionChime = useCallback(() => {
    const ctx = getAudioContext();
    
    // Major chord: C4, E4, G4, C5
    const frequencies = [261.63, 329.63, 392.00, 523.25];
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      // Stagger slightly for richness
      const startTime = ctx.currentTime + i * 0.03;
      const peakGain = 0.12 - i * 0.02;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      oscillator.start(startTime);
      oscillator.stop(startTime + 1.2);
    });

    // Add a second, higher octave chord for shimmer
    setTimeout(() => {
      const shimmerFreqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      shimmerFreqs.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.8);
      });
    }, 150);
  }, [getAudioContext]);

  // Play sound based on finding type
  const playFindingSound = useCallback((type: 'pass' | 'gap-major' | 'gap-minor' | 'ofi' | 'examining') => {
    switch (type) {
      case 'pass':
        playPassBeep();
        break;
      case 'gap-major':
        playGapBeep(true);
        break;
      case 'gap-minor':
        playGapBeep(false);
        break;
      case 'ofi':
        playOfiBeep();
        break;
      // 'examining' doesn't play a sound
    }
  }, [playPassBeep, playGapBeep, playOfiBeep]);

  return {
    playFindingSound,
    playAgentComplete,
    playCompletionChime,
  };
}
