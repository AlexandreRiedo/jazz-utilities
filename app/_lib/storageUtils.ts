export interface FormOptions {
  numberOfNotes: number;
  notePool: Set<string>;
  chordPool: Set<string>;
  allowRootDuplication: boolean;
  enableRandomSequence: boolean;
  numberOfSequences: number;
  sequencePool: Set<string>;
  allowSequenceDuplication: boolean;
}

export function getDefaultFormOptions(): FormOptions {
  return {
    numberOfNotes: typeof window !== 'undefined' && window.innerWidth < 1024 ? 8 : 8,
    notePool: new Set(["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"]),
    chordPool: new Set(["", "m", "dim", "maj7", "m7", "m7b5", "7", "°7", "mMaj7"]),
    allowRootDuplication: false,
    enableRandomSequence: false,
    numberOfSequences: 8,
    sequencePool: new Set(["1", "2", "3", "4", "5", "6", "△7"]),
    allowSequenceDuplication: false,
  };
}

export function getInitialFormOptions(): FormOptions {
  const defaultFormOptions = getDefaultFormOptions();

  if (typeof window !== 'undefined') {
    const storedFormOptions = localStorage.getItem("formOptionsStorage");
    if (storedFormOptions) {
      try {
        // Convert the stored arrays back to sets
        const parsed = JSON.parse(storedFormOptions);
        return {
          ...parsed,
          notePool: new Set(parsed.notePool),
          chordPool: new Set(parsed.chordPool),
          sequencePool: new Set(parsed.sequencePool),
        };
      } catch (error) {
        console.error("Failed to parse stored form options:", error);
      }
    }
  }

  return defaultFormOptions;
}
