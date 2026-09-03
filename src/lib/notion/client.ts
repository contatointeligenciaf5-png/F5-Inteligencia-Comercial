import { Client } from "@notionhq/client";

let client: Client | null = null;

/**
 * Instancia o Client sob demanda (não no module scope) para que só falhe quando
 * uma página de fato tentar buscar dados — permite às páginas mostrar um aviso
 * amigável de ".env.local não configurado" em vez de quebrar o build/import.
 */
export function getNotionClient(): Client {
  if (!client) {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      throw new Error("NOTION_API_KEY não configurada (veja .env.example)");
    }
    client = new Client({ auth: apiKey });
  }
  return client;
}

export type Estado = "SE" | "BA";

/**
 * IDs das data sources do ecossistema F5 no Notion — ver CLAUDE.md → "Mapa do
 * ecossistema Notion" para a árvore completa (Dashboard Geral / Sergipe / Bahia).
 *
 * Não são segredo (só o NOTION_API_KEY é) — por isso ficam hardcoded aqui, com
 * override por env var para o caso de mudarem ou você preferir configurar por
 * ambiente (staging vs. produção, por exemplo).
 */

/** Bases consolidadas em "Dashboard Geral" (o painel-mãe, fed pela Sincronização Geral). */
export const geralDataSourceIds = {
  /** Controle Geral: pipeline/CRM master (leads das 2 estados). */
  pipeline: process.env.NOTION_DS_PIPELINE_GERAL ?? "b9b37e33-5c8c-45d3-82b3-d42c46d7e66e",
  /** Comissões por Empresa: % / status de contrato das lojas parceiras. */
  comissoes: process.env.NOTION_DS_COMISSOES ?? "9dced5ce-fb8e-401a-8583-2ad1df901b63",
  /** Lançamentos Financeiros: receita/despesa, campo Estado = SE|BA|AL|Geral. */
  financeiro: process.env.NOTION_DS_FINANCEIRO_GERAL ?? "2d61cf5f-8884-4e3d-aefc-f250d98660e7",
  /** Insights F5 / Inovação. */
  insights: process.env.NOTION_DS_INSIGHTS ?? "4369f339-8244-485d-92f2-6592288ae899",
} as const;

/** Bases operacionais por estado (SE e BA têm a mesma estrutura — o método é replicado). */
export const estadoDataSourceIds: Record<
  Estado,
  {
    pipeline: string;
    scripts: string;
    prospeccoes: string;
    profissionais: string | null;
    rodizioDisparo: string | null;
  }
> = {
  SE: {
    pipeline: process.env.NOTION_DS_PIPELINE_SE ?? "80a69afa-557b-4498-9864-f9a975b95892",
    scripts: process.env.NOTION_DS_SCRIPTS_SE ?? "9e2ecf29-11d4-4195-92eb-1a411531178e",
    prospeccoes: process.env.NOTION_DS_PROSPECCOES_SE ?? "4fbcf056-fc10-43e6-b7fd-b4411fd0e889",
    profissionais: process.env.NOTION_DS_PROFISSIONAIS_SE ?? "620cab39-8f28-490f-8d1b-292c6404f635",
    rodizioDisparo: process.env.NOTION_DS_RODIZIO_SE ?? "4e9a7bd1-e7c9-4a9c-ac24-9487a22d4cb8",
  },
  BA: {
    pipeline: process.env.NOTION_DS_PIPELINE_BA ?? "b803c20e-085e-444b-bf0c-0dc8f89e0100",
    scripts: process.env.NOTION_DS_SCRIPTS_BA ?? "969aa39b-26ae-4dae-b315-e3be4a106c42",
    prospeccoes: process.env.NOTION_DS_PROSPECCOES_BA ?? "d4d83f50-cc13-417e-b0b2-2b633005ebe6",
    // TODO: confirmar o ID real (a página Bahia - BA tem 2 databases sem título
    // resolvido na exploração — prováveis candidatos, mas não confirmados via schema).
    profissionais: process.env.NOTION_DS_PROFISSIONAIS_BA ?? null,
    rodizioDisparo: process.env.NOTION_DS_RODIZIO_BA ?? null,
  },
};

export function pipelineDataSourceId(estado: Estado | "Geral"): string {
  return estado === "Geral" ? geralDataSourceIds.pipeline : estadoDataSourceIds[estado].pipeline;
}
