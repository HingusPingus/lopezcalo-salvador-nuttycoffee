import { useId } from "react";

// Campo con label asociado, mensaje de error y ayuda accesible.
export default function FormField({ label, error, hint, required = false, as = "input", children, ...props }) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const Control = as;
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`field ${error ? "field--invalid" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <Control
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        aria-required={required}
        {...props}
      >
        {children}
      </Control>
      {hint && <small id={hintId} className="field__hint">{hint}</small>}
      {error && <small id={errorId} className="field__error">{error}</small>}
    </div>
  );
}
