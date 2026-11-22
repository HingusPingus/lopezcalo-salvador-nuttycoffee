import Button from "./Button";

export default function StatusMessage({ title, message, onRetry }) {
  return (
    <div className="status-message" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Reintentar</Button>}
    </div>
  );
}
