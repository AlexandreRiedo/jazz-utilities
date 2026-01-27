function ChordCheckboxGroup({ chords, chordPool, onChordPoolChange, className }: {
  chords: Array<{ value: string; display: string } | string>;
  chordPool: Set<string>;
  onChordPoolChange: (newChordPool: Set<string>) => void;
  className?: string;
}) {
  return (
    <fieldset className={className || "flex flex-col gap-2 mb-2"}>
      {chords.map(item => {
        const chord = typeof item === 'string' ? { value: item, display: item } : item;
        return (
          <label key={chord.value} className="note-label">
            <span>{chord.display}</span>
            <input
              type="checkbox"
              value={chord.value}
              checked={chordPool.has(chord.value)}
              onChange={e => {
                const newChordPool = new Set(chordPool);
                if (e.target.checked) {
                  newChordPool.add(e.target.value);
                } else {
                  newChordPool.delete(e.target.value);
                }
                onChordPoolChange(newChordPool);
              }}
              className="note-checkbox"
            />
          </label>
        );
      })}
    </fieldset>
  );
}

export default ChordCheckboxGroup;
