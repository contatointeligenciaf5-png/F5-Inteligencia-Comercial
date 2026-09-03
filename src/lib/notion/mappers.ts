/**
 * Helpers genéricos para extrair valores de properties do Notion API
 * (formato REST, não o dos widgets internos do app). Reutilizados por todos os
 * mappers em src/lib/notion/*.ts — ver CLAUDE.md → "Modelo de dados".
 */

export function plainText(prop: unknown): string | null {
  const p = prop as { rich_text?: unknown[]; title?: unknown[] } | undefined;
  const arr = p?.rich_text ?? p?.title;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr.map((t) => (t as { plain_text: string }).plain_text).join("");
}

export function selectValue(prop: unknown): string | null {
  return (prop as { select?: { name: string } | null })?.select?.name ?? null;
}

export function multiSelectValues(prop: unknown): string[] {
  const options = (prop as { multi_select?: { name: string }[] })?.multi_select;
  return Array.isArray(options) ? options.map((o) => o.name) : [];
}

export function statusValue(prop: unknown): string | null {
  return (prop as { status?: { name: string } | null })?.status?.name ?? null;
}

export function numberValue(prop: unknown): number | null {
  return (prop as { number?: number | null })?.number ?? null;
}

export function dateValue(prop: unknown): string | null {
  return (prop as { date?: { start: string } | null })?.date?.start ?? null;
}

export function formulaValue(prop: unknown): number | string | boolean | null {
  const f = (prop as {
    formula?: { type: string; number?: number; string?: string; boolean?: boolean };
  })?.formula;
  if (!f) return null;
  if (f.type === "number") return f.number ?? null;
  if (f.type === "string") return f.string ?? null;
  if (f.type === "boolean") return f.boolean ?? null;
  return null;
}

export function relationIds(prop: unknown): string[] {
  const rel = (prop as { relation?: { id: string }[] })?.relation;
  return Array.isArray(rel) ? rel.map((r) => r.id) : [];
}

export type NotionPage = {
  id: string;
  url: string;
  properties: Record<string, unknown>;
};

function hasProperties(result: unknown): result is NotionPage {
  return typeof result === "object" && result !== null && "properties" in result;
}

/**
 * Pagina automaticamente um data source inteiro e mapeia cada page com `mapFn`.
 * Uso: sempre em Server Components / Route Handlers — nunca client-side (o token
 * do Notion não pode ser exposto ao browser).
 */
export async function queryAllPages<T>(
  notion: {
    dataSources: {
      query: (args: {
        data_source_id: string;
        start_cursor?: string;
        page_size?: number;
      }) => Promise<{ results: unknown[]; has_more: boolean; next_cursor: string | null }>;
    };
  },
  dataSourceId: string,
  mapFn: (page: NotionPage) => T,
): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | undefined;

  do {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
    });
    items.push(...res.results.filter(hasProperties).map(mapFn));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return items;
}
