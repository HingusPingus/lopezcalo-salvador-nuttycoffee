import { ESTADOS } from "../utils/estados";

export default function EstadoBadge({ estado }) {
  const info = ESTADOS[estado] ?? { label: estado, tone: "info" };
  return <span className={`badge badge--${info.tone}`}>{info.label}</span>;
}
