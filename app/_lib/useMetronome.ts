import { useState, useEffect, useRef } from 'react';

// Web Audio "lookahead scheduler": plain JS timers are too jittery to time
// audio, but the AudioContext clock is sample-accurate. So a setTimeout loop
// (`scheduler`) wakes every SCHEDULER_INTERVAL_MS, and schedules any clicks
// falling within the next LOOKAHEAD_SECONDS directly on the audio clock.
// UI updates (beat indicator, chord regeneration) ride along on setTimeouts
// aimed at the same instants.

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

const LOOKAHEAD_SECONDS = 0.1;
const SCHEDULER_INTERVAL_MS = 25;

// Click pitches (Hz)
const CYCLE_START_PITCH = 1000;
const DOWNBEAT_PITCH = 800;
const OFFBEAT_PITCH = 600;

// Click envelope
const CLICK_PEAK_GAIN = 0.3;
const CLICK_ATTACK_SECONDS = 0.002; // fast attack to keep it snappy
const CLICK_DURATION_SECONDS = 0.1;
const CLICK_END_GAIN = 0.001; // exponential ramp can't reach 0

// One metronome click: a short oscillator burst shaped by a gain envelope —
// fast attack, exponential decay — for a natural "pluck" sound.
function playClick(ctx: AudioContext, time: number, frequency: number) {
  const osc = ctx.createOscillator();
  const envelope = ctx.createGain();

  osc.frequency.value = frequency;

  envelope.gain.setValueAtTime(0, time);
  envelope.gain.linearRampToValueAtTime(CLICK_PEAK_GAIN, time + CLICK_ATTACK_SECONDS);
  envelope.gain.exponentialRampToValueAtTime(CLICK_END_GAIN, time + CLICK_DURATION_SECONDS);

  osc.connect(envelope);
  envelope.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + CLICK_DURATION_SECONDS);
}

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

  // Playback position on the audio clock — the source of truth while playing.
  // `metronomeState` above is only a UI mirror of it, synced by the delayed
  // setTimeout in scheduleNote.
  const nextNoteTimeRef = useRef<number>(0); // when the next click is due, in AudioContext time
  const beatRef = useRef<number>(0);
  const measureCountRef = useRef<number>(0); // Tracks progress through the cycle

  const timerIdRef = useRef<number | null>(null);

  // The scheduler loop runs outside React's render cycle, so it reads the
  // latest settings/callback through refs — values captured in its closure
  // would go stale after the first render.
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

    const isCycleStart = beatNumber === 0 && measureNumber === 0;
    const isDownbeat = beatNumber === 0;

    // The cycle-start accent only matters when chords switch per cycle;
    // with switching prevented, every downbeat sounds the same.
    const pitch =
      isCycleStart && !settingsRef.current.preventSwitching ? CYCLE_START_PITCH
      : isDownbeat ? DOWNBEAT_PITCH
      : OFFBEAT_PITCH;

    playClick(audioCtxRef.current, time, pitch);

    // The click is scheduled ahead of "now" — delay the React state update
    // so the beat indicator flips exactly when the click sounds.
    const msUntilClick = (time - audioCtxRef.current.currentTime) * 1000;
    setTimeout(() => {
      setMetronomeState(prev => ({
        ...prev,
        currentBeat: beatNumber,
        currentMeasure: measureNumber
      }));
    }, msUntilClick);
  };

  const scheduler = () => {
    if (!audioCtxRef.current) return;

    const settings = settingsRef.current;

    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + LOOKAHEAD_SECONDS) {
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
    timerIdRef.current = window.setTimeout(scheduler, SCHEDULER_INTERVAL_MS);
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
