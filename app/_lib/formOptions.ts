export interface FormOptions {
  numberOfNotes: number;
  notePool: Set<string>;
  chordPool: Set<string>;
  allowRootDuplication: boolean;
  showGuideToneDisplay: boolean;
  enableRandomSequence: boolean;
  numberOfSequences: number;
  sequencePool: Set<string>;
  allowSequenceDuplication: boolean;
}

export const FORM_OPTIONS_STORAGE_KEY = "formOptionsStorage";

export function getDefaultFormOptions(): FormOptions {
  return {
    numberOfNotes: 8,
    notePool: new Set(["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"]),
    chordPool: new Set(["", "m", "dim", "maj7", "m7", "m7b5", "7", "°7", "mMaj7"]),
    allowRootDuplication: false,
    showGuideToneDisplay: true,
    enableRandomSequence: false,
    numberOfSequences: 8,
    sequencePool: new Set(["1", "2", "3", "4", "5", "6", "△7"]),
    allowSequenceDuplication: false,
  };
}

export type PresetSlot = "A" | "B" | "C";

// Built-in content for the A/B/C slots, used when the user hasn't
// saved their own preset in a slot yet.
export function getBuiltInPreset(slot: PresetSlot): FormOptions {
  const preset = getDefaultFormOptions();
  switch (slot) {
    case "A": // gentle intro: just 2 triads
      preset.numberOfNotes = 2;
      preset.chordPool = new Set(["", "m", "dim", "sus2", "sus4"]);
      break;
    case "B": // 7th chords only
      preset.chordPool = new Set(["maj7", "m7", "m7b5", "7", "°7"]);
      break;
    case "C": // advanced chords, with a random sequence
      preset.chordPool = new Set([
        "6", "maj9", "maj13", "m9", "m11", "m6", "9", "13", "7sus4",
        "alt", "7b9", "7#11", "mMaj7", "13b9", "maj7#5",
      ]);
      preset.enableRandomSequence = true;
      break;
  }
  return preset;
}

// Sets aren't JSON-serializable, so the pools are stored as arrays
// and revived back into Sets on load.
export function saveFormOptions(key: string, options: FormOptions) {
  const serializable = {
    ...options,
    notePool: Array.from(options.notePool),
    chordPool: Array.from(options.chordPool),
    sequencePool: Array.from(options.sequencePool),
  };
  localStorage.setItem(key, JSON.stringify(serializable));
}

// Returns null when nothing is stored under `key`; throws on corrupt data.
export function loadFormOptions(key: string): FormOptions | null {
  const stored = localStorage.getItem(key);
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  return {
    ...parsed,
    notePool: new Set(parsed.notePool),
    chordPool: new Set(parsed.chordPool),
    sequencePool: new Set(parsed.sequencePool),
  };
}

export function getInitialFormOptions(): FormOptions {
  // localStorage doesn't exist during server-side rendering
  if (typeof window !== "undefined") {
    try {
      const stored = loadFormOptions(FORM_OPTIONS_STORAGE_KEY);
      if (stored) return stored;
    } catch (error) {
      console.error("Failed to parse stored form options:", error);
    }
  }

  return getDefaultFormOptions();
}
