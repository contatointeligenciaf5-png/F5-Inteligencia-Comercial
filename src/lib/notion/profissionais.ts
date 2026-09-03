import { getNotionClient, estadoDataSourceIds, type Estado } from "./client";
import { plainText, selectValue, queryAllPages, type NotionPage } from "./mappers";
import type { Profissional } from "./types";

export function mapProfissional(page: NotionPage): Profissional {
  const p = page.properties;
  return {
    id: page.id,
    url: page.url,
    nome: plainText(p["Nome"]) ?? "(sem nome)",
    tipo: selectValue(p["Tipo"]) as Profissional["tipo"],
    relacionamento: selectValue(p["Relacionamento"]) as Profissional["relacionamento"],
    empresaOuEscritorio: plainText(p["Empresa / Escritório"]),
    contato: plainText(p["Contato"]),
    estado: selectValue(p["Estado"]) as Profissional["estado"],
    observacoes: plainText(p["Observações"]),
  };
}

/**
 * Rede de arquitetos/engenheiros/construtoras (escada Não iniciado → Em contato →
 * Ativo). Lança erro para BA até o ID da data source ser confirmado
 * (ver TODO em src/lib/notion/client.ts).
 */
export async function getProfissionais(estado: Estado): Promise<Profissional[]> {
  const dataSourceId = estadoDataSourceIds[estado].profissionais;
  if (!dataSourceId) {
    throw new Error(
      `Data source "Profissionais" de ${estado} ainda não confirmada — preencha NOTION_DS_PROFISSIONAIS_${estado} ou ajuste src/lib/notion/client.ts.`,
    );
  }
  return queryAllPages(getNotionClient(), dataSourceId, mapProfissional);
}
