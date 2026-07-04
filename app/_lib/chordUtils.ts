import type { FormOptions } from './formOptions';

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Guide tones start from this base degree list ("7" means the flat 7,
// "maj7" the natural 7th); each chord quality edits it before one degree
// is picked at random.
const BASE_DEGREES = ["1", "9", "3", "#11", "5", "13", "7"];

interface DegreeEdits {
  swap?: Record<string, string>; // base degree -> replacement
  drop?: string[];               // base degrees removed outright
  add?: string[];                // degrees appended beyond the base list
}

// Edits shared by every quality of a chord family
const DOMINANT: DegreeEdits = { swap: { "#11": "4" } };
const MAJOR_SEVENTH: DegreeEdits = { swap: { "7": "maj7" } };
const MINOR_SEVENTH: DegreeEdits = { swap: { "3": "b3", "#11": "11" } };
const DIMINISHED: DegreeEdits = {
  swap: { "3": "b3", "#11": "11", "5": "b5", "13": "b13", "7": "maj7" },
  add: ["13"], // the whole-half diminished scale has both b13 and 13
};

const EDITS_BY_QUALITY: Record<string, DegreeEdits> = {
  "7": DOMINANT,
  "9": DOMINANT,
  "13": DOMINANT,
  "7sus4": DOMINANT,
  // "7#11" (lydian dominant) is absent on purpose: the base list already fits

  // Major triad uses 4, 6, and maj7
  "": { swap: { "#11": "4", "13": "6", "7": "maj7" } },
  "6": MAJOR_SEVENTH,
  "maj7": MAJOR_SEVENTH,
  "maj9": MAJOR_SEVENTH,
  "maj7#11": MAJOR_SEVENTH,
  "maj13": MAJOR_SEVENTH,
  "maj7#5": { swap: { "5": "#5", "7": "maj7" } },

  "m": { swap: { "3": "b3", "#11": "11", "13": "b13" } },
  "m7": MINOR_SEVENTH,
  "m9": MINOR_SEVENTH,
  "m11": MINOR_SEVENTH,
  "m6": MINOR_SEVENTH,
  "mMaj7": { swap: { "3": "b3", "#11": "11", "7": "maj7" } },
  // Use locrian#2 by default
  "m7b5": { swap: { "3": "b3", "#11": "11", "5": "b5", "13": "b13" } },

  "alt": { swap: { "9": "b9", "13": "b13" }, drop: ["5"], add: ["#9"] },
  "7b9": { swap: { "9": "b9", "#11": "4", "13": "b13" } },
  "13b9": { swap: { "9": "b9" }, add: ["#9"] },

  "dim": DIMINISHED,
  "°7": DIMINISHED,
};

export function generateRandomTargetTone(chordQuality: string) {
  const { swap = {}, drop = [], add = [] } = EDITS_BY_QUALITY[chordQuality] ?? {};

  const allowedDegrees = BASE_DEGREES
    .filter(degree => !drop.includes(degree))
    .map(degree => swap[degree] ?? degree)
    .concat(add);

  return pickRandom(allowedDegrees);
}

export function mainRandomGenerate({ numberOfNotes, notePool, chordPool, allowRootDuplication }: Pick<FormOptions, "numberOfNotes" | "notePool" | "chordPool" | "allowRootDuplication">) {
  let notePoolArray = Array.from(notePool);
  const chordQuality = Array.from(chordPool);
  const chordListResult = [];
  const targetToneListResult = [];

  for (let i = 0; i < numberOfNotes; i++) {
    const note = pickRandom(notePoolArray);
    const extension = pickRandom(chordQuality);
    const rawChord = note + extension;

    targetToneListResult.push(generateRandomTargetTone(extension));
    chordListResult.push(rawChord);

    if (!allowRootDuplication) {
      notePoolArray.splice(notePoolArray.indexOf(note), 1);
      if (notePoolArray.length === 0) notePoolArray = Array.from(notePool);
    }
  }

  return { chords: chordListResult, targetTones: targetToneListResult };
}

export function generateSequence({ numberOfSequences, sequencePool, allowSequenceDuplication }: Pick<FormOptions, "numberOfSequences" | "sequencePool" | "allowSequenceDuplication">) {
  let sequencePoolArray = Array.from(sequencePool);
  const sequenceListResult = [];

  for (let i = 0; i < numberOfSequences; i++) {
    const sequence = pickRandom(sequencePoolArray);
    sequenceListResult.push(sequence);

    if (!allowSequenceDuplication) {
      sequencePoolArray.splice(sequencePoolArray.indexOf(sequence), 1);
      if (sequencePoolArray.length === 0) sequencePoolArray = Array.from(sequencePool);
    }
  }

  return sequenceListResult;
}
