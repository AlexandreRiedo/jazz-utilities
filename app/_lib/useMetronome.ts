import { useState, useEffect, useRef } from 'react';

export interface MetronomeSettings {
  tempo: number;
  timeSignature: { beats: number; noteValue: number };
  measures: number; // The "Cycle" length
  preventSwitching: boolean;
}

export interface MetronomeState {
  isPlaying: boolean;
  currentBeat: number;
  currentMeasure: number;
}

const LOOKAHEAD = 0.1;
const SCHEDULE_INTERVAL = 25.0;

export function useMetronome(onMeasureCycleComplete: () => void) {
  const [metronomeSettings, setMetronomeSettings] = useState<MetronomeSettings>({
    tempo: 100,
    timeSignature: { beats: 4, noteValue: 4 },
    measures: 4,
    preventSwitching: true
  });

  const [metronomeState, setMetronomeState] = useState<MetronomeState>({
    isPlaying: false,
    currentBeat: 0,
    currentMeasure: 0,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const beatRef = useRef<number>(0);
  const measureCountRef = useRef<number>(0); // Tracks progress through the cycle
  const timerIdRef = useRef<number | null>(null);
  const settingsRef = useRef<MetronomeSettings>(metronomeSettings);
  const onCycleCompleteRef = useRef(onMeasureCycleComplete);

  // Keep refs in sync with latest values
  useEffect(() => {
    settingsRef.current = metronomeSettings;
  }, [metronomeSettings]);

  useEffect(() => {
    onCycleCompleteRef.current = onMeasureCycleComplete;
  }, [onMeasureCycleComplete]);

  const scheduleNote = (beatNumber: number, measureNumber: number, time: number) => {
    if (!audioCtxRef.current) return;

    const osc = audioCtxRef.current.createOscillator();
    const envelope = audioCtxRef.current.createGain();

    // Frequency logic (Pitch)
    const isFirstBeatOfCycle = beatNumber === 0 && measureNumber === 0;
    const isDownbeat = beatNumber === 0;
    
    // Use consistent pitch when prevent switching is enabled
    if (settingsRef.current.preventSwitching) {
      osc.frequency.value = isDownbeat ? 800 : 600;
    } else {
      osc.frequency.value = isFirstBeatOfCycle ? 1000 : isDownbeat ? 800 : 600;
    }

    const peakGain = 0.3;

    envelope.gain.setValueAtTime(0, time);
    // Fast attack to keep it snappy
    envelope.gain.linearRampToValueAtTime(peakGain, time + 0.002);
    // Exponential decay for a natural "pluck" sound
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(envelope);
    envelope.connect(audioCtxRef.current.destination);

    osc.start(time);
    osc.stop(time + 0.1);

    // Sync visual UI with Audio clock
    const diff = (time - audioCtxRef.current.currentTime) * 1000;
    setTimeout(() => {
      setMetronomeState(prev => ({
        ...prev,
        currentBeat: beatNumber,
        currentMeasure: measureNumber
      }));
    }, diff);
  };

  const scheduler = () => {
    if (!audioCtxRef.current) return;

    const settings = settingsRef.current;

    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + LOOKAHEAD) {
      // 1. Schedule the current note
      scheduleNote(beatRef.current, measureCountRef.current, nextNoteTimeRef.current);

      // 2. Advance the clock
      const secondsPerBeat = 60.0 / settings.tempo;
      nextNoteTimeRef.current += secondsPerBeat;

      // 3. Advance Beat/Measure Logic
      beatRef.current++;

      // If we finished a measure
      if (beatRef.current >= settings.timeSignature.beats) {
        beatRef.current = 0;
        measureCountRef.current++;

        // 4. Check if the full cycle (e.g., 4 measures) is complete
        if (measureCountRef.current >= settings.measures) {
          measureCountRef.current = 0; // Reset measure count

          // Trigger chord generation precisely when the next cycle starts
          // We wrap this in a precise timeout to match the audio
          if (!settings.preventSwitching) {
            const diff = (nextNoteTimeRef.current - audioCtxRef.current.currentTime) * 1000;
            setTimeout(() => onCycleCompleteRef.current(), diff);
          }
        }
      }
    }
    timerIdRef.current = window.setTimeout(scheduler, SCHEDULE_INTERVAL);
  };

  const toggleMetronome = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (metronomeState.isPlaying) {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      setMetronomeState(prev => ({ ...prev, isPlaying: false }));
    } else {
      beatRef.current = 0;
      measureCountRef.current = 0;
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
      setMetronomeState(prev => ({ ...prev, isPlaying: true }));
      scheduler();
    }
  };

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return {
    metronomeSettings,
    setMetronomeSettings,
    metronomeState,
    toggleMetronome,
  };
}