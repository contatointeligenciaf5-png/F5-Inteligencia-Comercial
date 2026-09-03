import { getNotionClient, geralDataSourceIds } from "./client";
import { plainText, selectValue, numberValue, queryAllPages, type NotionPage } from "./mappers";
import type { ComissaoEmpresa } from "./types";

export function mapComissaoEmpresa(page: NotionPage): ComissaoEmpresa {
  const p = page.properties;
  return {
    id: page.id,
    url: page.url,
    empresa: plainText(p["Empresa"]) ?? "(sem nome)",
    statusDoContrato: selectValue(p["Status do contrato"]) as ComissaoEmpresa["statusDoContrato"],
    tipoDeComissao: selectValue(p["Tipo de comissão"]) as ComissaoEmpresa["tipoDeComissao"],
    percentual: numberValue(p["Percentual (%)"]),
    valorFixoMensal: numberValue(p["Valor fixo mensal (R$)"]),
    observacoes: plainText(p["Observações"]),
  };
}

/** Comissões por Empresa — base consolidada única (não existe por estado). */
export async function getComissoesPorEmpresa(): Promise<ComissaoEmpresa[]> {
  return queryAllPages(getNotionClient(), geralDataSourceIds.comissoes, mapComissaoEmpresa);
}
