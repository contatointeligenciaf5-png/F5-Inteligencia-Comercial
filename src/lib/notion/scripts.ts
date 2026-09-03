import { getNotionClient, estadoDataSourceIds, type Estado } from "./client";
import {
  plainText,
  selectValue,
  numberValue,
  dateValue,
  queryAllPages,
  type NotionPage,
} from "./mappers";
import type { ScriptWhatsapp } from "./types";

export function mapScript(page: NotionPage): ScriptWhatsapp {
  const p = page.properties;
  return {
    id: page.id,
    url: page.url,
    nomeDoScript: plainText(p["Nome do Script"]) ?? "(sem nome)",
    empresa: selectValue(p["Empresa"]),
    segmento: selectValue(p["Segmento"]),
    etapaDoFunil: selectValue(p["Etapa do Funil"]) as ScriptWhatsapp["etapaDoFunil"],
    status: selectValue(p["Status"]) as ScriptWhatsapp["status"],
    leadsEnviados: numberValue(p["Leads enviados (qtd)"]),
    respostasRecebidas: numberValue(p["Respostas recebidas (qtd)"]),
    taxaDeResposta: numberValue(p["Taxa de resposta (%)"]),
    versao: numberValue(p["Versão"]),
    dataDeCriacao: dateValue(p["Data de criação"]),
    dataDoUltimoDisparo: dateValue(p["Data do último disparo"]),
    observacoes: plainText(p["Observações / Aprendizados"]),
  };
}

/** Scripts de WhatsApp de um estado (a Central de Scripts é mantida por estado, sem versão "Geral"). */
export async function getScripts(estado: Estado): Promise<ScriptWhatsapp[]> {
  return queryAllPages(getNotionClient(), estadoDataSourceIds[estado].scripts, mapScript);
}
