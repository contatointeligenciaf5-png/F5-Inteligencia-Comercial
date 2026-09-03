/**
 * Barra horizontal simples em CSS puro — sem lib de gráfico ainda (ver CLAUDE.md →
 * roadmap). Serve para distribuições (contagem por categoria) e rankings.
 */
export function BarList({
  items,
  formatValue = (v) => String(v),
}: {
  items: { label: string; value: number }[];
  formatValue?: (value: number) => string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));

  if (items.length === 0) {
    return <p className="text-sm text-neutral-400">Sem dados.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-sm text-neutral-600" title={item.label}>
            {item.label}
          </span>
          <div className="h-2 flex-1 rounded-full bg-neutral-100">
            <div
              className="h-2 rounded-full bg-neutral-900"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-sm tabular-nums text-neutral-500">
            {formatValue(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
