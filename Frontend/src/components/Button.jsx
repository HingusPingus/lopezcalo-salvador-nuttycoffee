export default function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="spinner spinner--small" aria-hidden="true" />}
      {children}
    </button>
  );
}
