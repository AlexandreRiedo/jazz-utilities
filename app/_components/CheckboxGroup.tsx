// Items are plain strings unless the stored value and the label differ
// (e.g. the major chord is stored as "" but displayed as "maj").
type CheckboxItem = string | { value: string; display: string };

function CheckboxGroup({ items, selected, onChange, className, disabled }: {
  items: CheckboxItem[];
  selected: Set<string>;
  onChange: (newSelected: Set<string>) => void;
  className: string;
  disabled?: boolean;
}) {
  return (
    <fieldset className={className} disabled={disabled}>
      {items.map(item => {
        const { value, display } = typeof item === 'string' ? { value: item, display: item } : item;
        return (
          <label key={value} className="note-label">
            <span data-disabled={disabled} className="data-[disabled=true]:opacity-40 data-[disabled=true]:cursor-not-allowed">{display}</span>
            <input
              type="checkbox"
              value={value}
              checked={selected.has(value)}
              disabled={disabled}
              onChange={e => {
                const newSelected = new Set(selected);
                if (e.target.checked) {
                  newSelected.add(value);
                } else {
                  newSelected.delete(value);
                }
                onChange(newSelected);
              }}
              className="note-checkbox disabled:opacity-40"
            />
          </label>
        );
      })}
    </fieldset>
  );
}

export default CheckboxGroup;
