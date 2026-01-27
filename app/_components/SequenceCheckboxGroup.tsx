function SequenceCheckboxGroup({ sequences, sequencePool, onSequencePoolChange, disabled = false }: {
  sequences: string[];
  sequencePool: Set<string>;
  onSequencePoolChange: (newSequencePool: Set<string>) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="grid grid-cols-4 gap-2 mb-2 disabled:cursor-not-allowed" disabled={disabled}>
      {sequences.map(item => (
        <label key={item} className="note-label">
          <span data-disabled={disabled} className="data-[disabled=true]:opacity-40 data-[disabled=true]:cursor-not-allowed">{item}</span>
          <input
            type="checkbox"
            value={item}
            checked={sequencePool.has(item)}
            disabled={disabled}
            onChange={e => {
              const newSequencePool = new Set(sequencePool);
              if (e.target.checked) {
                newSequencePool.add(e.target.value);
              } else {
                newSequencePool.delete(e.target.value);
              }
              onSequencePoolChange(newSequencePool);
            }}
            className="note-checkbox disabled:opacity-40 !disabled:cursor-not-allowed"
          />
        </label>
      ))}
    </fieldset>
  );
}

export default SequenceCheckboxGroup;
