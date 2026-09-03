import Link from "next/link";
import { cn } from "@/lib/utils";

export interface EstadoOption {
  value: string;
  label: string;
}

export const ESTADOS_GERAL_SE_BA: EstadoOption[] = [
  { value: "Geral", label: "Geral" },
  { value: "SE", label: "Sergipe" },
  { value: "BA", label: "Bahia" },
];

export const ESTADOS_SE_BA: EstadoOption[] = [
  { value: "SE", label: "Sergipe" },
  { value: "BA", label: "Bahia" },
];

/**
 * Seletor de estado (Geral/SE/BA) via query string — cada módulo decide quais
 * data sources existem por estado (ver CLAUDE.md → "Regra de design do Portal").
 * Componente de servidor: só monta links, sem JS no client.
 */
export function StateTabs({
  basePath,
  current,
  options,
}: {
  basePath: string;
  current: string;
  options: EstadoOption[];
}) {
  return (
    <div className="mb-6 inline-flex rounded-lg border border-neutral-200 bg-white p-1">
      {options.map((opt) => {
        const isActive = opt.value === current;
        return (
          <Link
            key={opt.value}
            href={`${basePath}?estado=${opt.value}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
