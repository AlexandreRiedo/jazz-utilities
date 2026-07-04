// The form number-input recipe: shared box styling plus the blur clamp —
// empty or < 1 snaps to `clampMin` (defaults to `min`), above `max` snaps
// to `max`. Caller passes color scheme and margins via `className`.
function ClampedNumberInput({ id, value, onChange, min, max, clampMin, className, disabled }: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max?: number;
  clampMin?: number;
  className: string;
  disabled?: boolean;
}) {
  return (
    <input
      id={id}
      type="number"
      className={`block w-full px-4 py-1 border-2 text-lg focus:outline-0 ${className}`}
      value={value || ''}
      onChange={e => onChange(parseInt(e.target.value) || 0)}
      onBlur={() => {
        if (!value || value < 1) {
          onChange(clampMin ?? min);
        } else if (max !== undefined && value > max) {
          onChange(max);
        }
      }}
      min={min}
      max={max}
      disabled={disabled}
    />
  );
}

export default ClampedNumberInput;