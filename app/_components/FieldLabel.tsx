import { ReactNode } from 'react';

// The recurring form-label recipe. `disabled` dims the label through the
// data-attribute, matching the convention used in CheckboxGroup.
function FieldLabel({ htmlFor, disabled, className, children }: {
  htmlFor?: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      data-disabled={disabled}
      className={`block font-normal text-xl text-stone-900 data-[disabled=true]:opacity-40 ${className ?? ''}`}
    >
      {children}
    </label>
  );
}

export default FieldLabel;
