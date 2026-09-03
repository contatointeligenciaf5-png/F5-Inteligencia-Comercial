import { getNotionClient, pipelineDataSourceId, type Estado as EstadoFiltro } from "./client";
import {
  plainText,
  selectValue,
  statusValue,
  numberValue,
  dateValue,
  formulaValue,
  queryAllPages,
  type NotionPage,
} from "./mappers";
import type { LeadPipeline } from "./types";

/**
 * Converte uma page do data source "Controle Geral" no shape LeadPipeline.
 * Ajuste os nomes de propriedade aqui se o schema no Notion mudar
 * (ver CLAUDE.md → "Modelo de dados" para a fonte de verdade).
 */
export function mapLeadPipeline(page: NotionPage): LeadPipeline {
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
 * Busca os leads do pipeline. `estado` seleciona a data source:
 * "Geral" = Controle Geral consolidado (Dashboard Geral), "SE"/"BA" = pipeline
 * específico daquele estado (mesmo schema, ver CLAUDE.md).
 */
export async function getPipelineLeads(
  estado: EstadoFiltro | "Geral" = "Geral",
): Promise<LeadPipeline[]> {
  return queryAllPages(getNotionClient(), pipelineDataSourceId(estado), mapLeadPipeline);
}
