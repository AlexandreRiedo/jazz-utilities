export function generateRandomTargetTone(chordQuality: string) {
  // The form to select target tones will return a primitive extension list as shown below,
  // Each chord scale will just deviate from this base extension list.
  const allowedExtensionDegrees = ["1", "9", "3", "#11", "5", "13", "7"];

  switch (chordQuality) {
    case "7":
    case "9":
    case "13":
    case "7sus4":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "4");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    // Major Triad uses 4 and not #11
    case "":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "4");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "6");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("7"), 1, "maj7");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    case "6":
    case "maj7":
    case "maj9":
    case "maj7#11":
    case "maj13":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("7"), 1, "maj7");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    case "maj7#5":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("5"), 1, "#5");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("7"), 1, "maj7");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    case "m":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("3"), 1, "b3");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "11");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "b13");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];
    case "m7":
    case "m9":
    case "m11":
    case "m6":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("3"), 1, "b3");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "11");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    case "mMaj7":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("3"), 1, "b3");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "11");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("7"), 1, "maj7");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    // Use locrian#2 by default
    case "m7b5":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "11");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("5"), 1, "b5");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "b13");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    case "alt":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("9"), 1, "b9");
      allowedExtensionDegrees.push("#9");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("5"), 1);
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "b13");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    case "7b9":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("9"), 1, "b9");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "4");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "b13");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    case "13b9":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("9"), 1, "b9");
      allowedExtensionDegrees.push("#9");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    case "dim":
    case "°7":
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("3"), 1, "b3");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "11");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("5"), 1, "b5");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "b13");
      allowedExtensionDegrees.push("13");
      allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("7"), 1, "maj7");
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

    // Lydian dominant: the base extension list (with #11 and b7) is already correct
    case "7#11":
    default:
      return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];
  }
}

export function mainRandomGenerate({ numberOfNotes, notePool, chordPool, allowRootDuplication }: { numberOfNotes: number, notePool: Set<string>, chordPool: Set<string>, allowRootDuplication: boolean }) {
  let notePoolArray = Array.from(notePool);
  const chordQuality = Array.from(chordPool);
  const chordListResult = [];
  const targetToneListResult = [];

  for (let i = 0; i < numberOfNotes; i++) {
    const note = notePoolArray[Math.floor(Math.random() * notePoolArray.length)];
    const extension = chordQuality[Math.floor(Math.random() * chordQuality.length)];
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

export function generateSequence({ numberOfSequences, sequencePool, allowSequenceDuplication }: { numberOfSequences: number, sequencePool: Set<string>, allowSequenceDuplication: boolean }) {
  let sequencePoolArray = Array.from(sequencePool);
  const sequenceListResult = [];

  for (let i = 0; i < numberOfSequences; i++) {
    const sequence = sequencePoolArray[Math.floor(Math.random() * sequencePoolArray.length)];
    sequenceListResult.push(sequence);

    if (!allowSequenceDuplication) {
      sequencePoolArray.splice(sequencePoolArray.indexOf(sequence), 1);
      if (sequencePoolArray.length === 0) sequencePoolArray = Array.from(sequencePool);
    }
  }

  return sequenceListResult;
}