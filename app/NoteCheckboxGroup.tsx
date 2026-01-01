function NoteCheckboxGroup({ notes, notePool, onNotePoolChange }: {
  notes: string[];
  notePool: Set<string>;
  onNotePoolChange: (newNotePool: Set<string>) => void;
}) {
  return (
    <fieldset className="flex flex-row gap-2 my-2">
      {notes.map(item => (
        <label key={item} className="note-label">
          <span>{item}</span>
          <input
            type="checkbox"
            value={item}
            checked={notePool.has(item)}
            onChange={e => {
              const newNotePool = new Set(notePool);
              if (e.target.checked) {
                newNotePool.add(e.target.value);
              } else {
                newNotePool.delete(e.target.value);
              }
              onNotePoolChange(newNotePool);
            }}
            className="note-checkbox"
          />
        </label>
      ))}
    </fieldset>
  );
}

export default NoteCheckboxGroup;
