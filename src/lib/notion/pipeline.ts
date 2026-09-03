import { notion, dataSourceIds } from "./client";
import type { LeadPipeline } from "./types";

/**
 * Extrai o texto puro de uma property Notion (rich_text ou title).
 */
function plainText(prop: unknown): string | null {
  const arr = (prop as { rich_text?: unknown[]; title?: unknown[] })
    ?.rich_text ?? (prop as { title?: unknown[] })?.title;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr.map((t) => (t as { plain_text: string }).plain_text).join("");
}

function selectValue(prop: unknown): string | null {
  return (prop as { select?: { name: string } | null })?.select?.name ?? null;
}

function statusValue(prop: unknown): string | null {
  return (prop as { status?: { name: string } | null })?.status?.name ?? null;
}

function numberValue(prop: unknown): number | null {
  return (prop as { number?: number | null })?.number ?? null;
}

function dateValue(prop: unknown): string | null {
  return (prop as { date?: { start: string } | null })?.date?.start ?? null;
}

function formulaValue(prop: unknown): number | string | null {
  const f = (prop as { formula?: { type: string; number?: number; string?: string } })
    ?.formula;
  if (!f) return null;
  if (f.type === "number") return f.number ?? null;
  if (f.type === "string") return f.string ?? null;
  return null;
}

/**
 * Converte uma page do data source "Controle Geral" no shape LeadPipeline.
 * Ajuste os nomes de propriedade aqui se o schema no Notion mudar
 * (ver CLAUDE.md → "Modelo de dados" para a fonte de verdade).
 */
export function mapLeadPipeline(page: {
  id: string;
  url: string;
  properties: Record<string, unknown>;
}): LeadPipeline {
  const p = page.properties;
  return {
    id: page.id,
    url: page.url,
    nomeDoLead: plainText(p["Nome do Lead"]) ?? "(sem nome)",
    estado: selectValue(p["Estado"]) as LeadPipeline["estado"],
    baseDeOrigem: selectValue(p["Base de origem"]),
    status: statusValue(p["Status de Movimentação"]) as LeadPipeline["status"],
    temperatura: selectValue(p["Temperatura"]) as LeadPipeline["temperatura"],
    tipo: selectValue(p["Tipo"]) as LeadPipeline["tipo"],
    situacaoDoLead: selectValue(p["Situação do lead"]) as LeadPipeline["situacaoDoLead"],
    origem: selectValue(p["Origem"]) as LeadPipeline["origem"],
    canal: selectValue(p["Canal"]) as LeadPipeline["canal"],
    arquiteto: plainText(p["Arquiteto"]),
    proximaAcao: plainText(p["Próxima ação"]),
    observacoes: plainText(p["Observações"]),
    valorPotencial: numberValue(p["Valor potencial"]),
    valorDaVenda: numberValue(p["Valor da venda (R$)"]),
    comissaoPercentual: numberValue(p["Comissão (%)"]),
    dataDoContato: dateValue(p["Data do contato"]),
    dataDoProximoContato: dateValue(p["Data do próximo contato"]),
    ultimaInteracao: dateValue(p["Última interação"]),
    scoreF5: (formulaValue(p["Score F5"]) as number) ?? null,
    diasSemInteracao: (formulaValue(p["Dias sem interação"]) as number) ?? null,
    slaFollowUpF5: (formulaValue(p["SLA Follow-up F5"]) as string) ?? null,
  };
}

/**
 * Busca todos os leads do pipeline (pagina automaticamente).
 * Uso: dentro de Server Components / Route Handlers apenas — nunca client-side
 * (o token do Notion não pode ser exposto ao browser).
 */
export async function getPipelineLeads(): Promise<LeadPipeline[]> {
  const leads: LeadPipeline[] = [];
  let cursor: string | undefined;

  do {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceIds.pipeline,
      start_cursor: cursor,
      page_size: 100,
    });
    leads.push(
      ...res.results
        .filter((r): r is typeof r & { properties: Record<string, unknown> } => "properties" in r)
        .map((r) => mapLeadPipeline(r as { id: string; url: string; properties: Record<string, unknown> })),
    );
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return leads;
}
