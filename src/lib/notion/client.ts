import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY não configurada (veja .env.example)");
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * IDs das data sources do Notion usadas pelo Portal.
 * Preencha no .env.local — ver .env.example para onde encontrar cada ID.
 */
export const dataSourceIds = {
  /** Base "Controle Geral": pipeline consolidado de leads/parceiros (SE, BA, AL). */
  pipeline: process.env.NOTION_DS_PIPELINE ?? "",
  /** Base "Comissões por Empresa": contratos e % por loja parceira. */
  comissoes: process.env.NOTION_DS_COMISSOES ?? "",
  /** Base "Central de Scripts": scripts de WhatsApp por empresa/segmento/etapa. */
  scripts: process.env.NOTION_DS_SCRIPTS ?? "",
  /** Base "Insights F5 / Inovação". */
  insights: process.env.NOTION_DS_INSIGHTS ?? "",
} as const;
