import { useState, useEffect } from 'react';

export interface MetronomeSettings {
  tempo: number;
  timeSignature: { beats: number; noteValue: number };
  measures: number;
}

export interface MetronomeState {
  isPlaying: boolean;
  currentBeat: number;
  currentMeasure: number;
}

// Play metronome sound
function playMetronomeClick(isDownbeat: boolean) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Higher pitch for downbeat (first beat), lower for other beats
  oscillator.frequency.value = isDownbeat ? 1000 : 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

export function useMetronome(onMeasureCycleComplete: () => void) {
  const [metronomeSettings, setMetronomeSettings] = useState<MetronomeSettings>({
    tempo: 120,
    timeSignature: { beats: 4, noteValue: 4 },
    measures: 1
  });

  const [metronomeState, setMetronomeState] = useState<MetronomeState>({
    isPlaying: false,
    currentBeat: 0,
    currentMeasure: 0
  });

  // Metronome Logic - using accurate timing approach
  useEffect(() => {
    if (!metronomeState.isPlaying) return;

    const beatInterval = 60000 / metronomeSettings.tempo; // milliseconds per beat
    const startTime = performance.now();
    let expectedBeatTime = startTime + beatInterval;
    let timeoutId: number;
    
    function tick() {
      const currentTime = performance.now();
      const timeTillNextBeat = expectedBeatTime - currentTime;
      
      // If we're close enough to the beat time (within 10ms), trigger the beat
      if (timeTillNextBeat < 10) {
        setMetronomeState(prev => {
          const nextBeat = (prev.currentBeat + 1) % metronomeSettings.timeSignature.beats;
          const nextMeasure = nextBeat === 0 ? prev.currentMeasure + 1 : prev.currentMeasure;

          // Play click sound
          playMetronomeClick(nextBeat === 0);

          // Trigger callback when completing the specified number of measures
          if (nextMeasure > 0 && nextMeasure % metronomeSettings.measures === 0 && nextBeat === 0) {
            onMeasureCycleComplete();
          }

          return {
            ...prev,
            currentBeat: nextBeat,
            currentMeasure: nextMeasure
          };
        });
        
        // Schedule next beat
        expectedBeatTime += beatInterval;
      }
      
      // Schedule next tick
      timeoutId = window.setTimeout(tick, Math.min(expectedBeatTime - performance.now(), beatInterval));
    }
    
    // Start the first tick
    tick();

    return () => clearTimeout(timeoutId);
  }, [metronomeState.isPlaying, metronomeSettings.tempo, metronomeSettings.timeSignature.beats, metronomeSettings.measures, onMeasureCycleComplete]);

  function toggleMetronome() {
    setMetronomeState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
      currentBeat: prev.isPlaying ? 0 : prev.currentBeat,
      currentMeasure: prev.isPlaying ? 0 : prev.currentMeasure
    }));
  }

  return {
    metronomeSettings,
    setMetronomeSettings,
    metronomeState,
    toggleMetronome
  };
}
