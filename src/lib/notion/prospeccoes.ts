import { getNotionClient, estadoDataSourceIds, type Estado } from "./client";
import {
  plainText,
  selectValue,
  multiSelectValues,
  dateValue,
  queryAllPages,
  type NotionPage,
} from "./mappers";
import type { Prospeccao } from "./types";

export function mapProspeccao(page: NotionPage): Prospeccao {
  const p = page.properties;
  return {
    id: page.id,
    url: page.url,
    proprietario: plainText(p["Proprietário"]) ?? "(sem nome)",
    estado: selectValue(p["Estado"]) as Prospeccao["estado"],
    etapaDaObra: selectValue(p["Etapa da obra"]) as Prospeccao["etapaDaObra"],
    padrao: selectValue(p["Padrão"]) as Prospeccao["padrao"],
    condominio: plainText(p["Condomínio"]),
    enderecoLote: plainText(p["Endereço/Lote"]),
    arquiteto: plainText(p["Arquiteto"]),
    engenheiro: plainText(p["Engenheiro"]),
    mestreDeObras: plainText(p["Mestre de obras"]),
    empresasQueJaContataram: multiSelectValues(p["Empresas que já contataram"]),
    lojaDaVez: plainText(p["Loja da vez"]),
    ultimoDisparo: dateValue(p["Último disparo"]),
    dataDaProspeccao: plainText(p["Data da prospecção"]),
  };
}

/** Prospecções de campo (obras/condomínios) — base só existe por estado. */
export async function getProspeccoes(estado: Estado): Promise<Prospeccao[]> {
  return queryAllPages(getNotionClient(), estadoDataSourceIds[estado].prospeccoes, mapProspeccao);
}
