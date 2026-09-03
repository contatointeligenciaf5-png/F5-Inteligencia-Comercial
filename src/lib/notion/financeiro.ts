import { getNotionClient, geralDataSourceIds } from "./client";
import { plainText, selectValue, numberValue, dateValue, queryAllPages, type NotionPage } from "./mappers";
import type { LancamentoFinanceiro } from "./types";

export function mapLancamentoFinanceiro(page: NotionPage): LancamentoFinanceiro {
  const p = page.properties;
  return {
    id: page.id,
    url: page.url,
    descricao: plainText(p["Descrição"]) ?? "(sem descrição)",
    tipo: selectValue(p["Tipo"]) as LancamentoFinanceiro["tipo"],
    categoria: selectValue(p["Categoria"]) as LancamentoFinanceiro["categoria"],
    centroDeCusto: selectValue(p["Centro de custo"]) as LancamentoFinanceiro["centroDeCusto"],
    estado: selectValue(p["Estado"]) as LancamentoFinanceiro["estado"],
    valor: numberValue(p["Valor"]),
    status: selectValue(p["Status"]) as LancamentoFinanceiro["status"],
    competencia: dateValue(p["Competência"]),
    dataDeVencimento: dateValue(p["Data de vencimento"]),
    dataDePagamentoRecebimento: dateValue(p["Data de pagamento/recebimento"]),
    clienteFornecedor: plainText(p["Cliente/Fornecedor"]),
  };
}

/**
 * Lançamentos Financeiros — base consolidada única, já traz o campo `Estado`
 * (SE/BA/AL/Geral) para filtrar sem precisar de uma data source por estado.
 */
export async function getLancamentosFinanceiros(): Promise<LancamentoFinanceiro[]> {
  return queryAllPages(getNotionClient(), geralDataSourceIds.financeiro, mapLancamentoFinanceiro);
}
