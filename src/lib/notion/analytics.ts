/**
 * Cálculos puros (sem I/O) sobre os dados já buscados do Notion — a camada de
 * "estudo de performance" pedida pelo Fellipe: funil, conversão entre etapas,
 * ranking de scripts, cobertura de rodízio, resumo financeiro. Mantida separada
 * dos mappers para ser fácil de testar e reaproveitar entre páginas.
 */

import type {
  LeadPipeline,
  StatusMovimentacao,
  ScriptWhatsapp,
  Prospeccao,
  Profissional,
  LancamentoFinanceiro,
} from "./types";

export function groupCount<T>(
  items: T[],
  keyFn: (item: T) => string | null | undefined,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item) ?? "(vazio)";
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

export function sum<T>(items: T[], valueFn: (item: T) => number | null | undefined): number {
  return items.reduce((acc, item) => acc + (valueFn(item) ?? 0), 0);
}

export function conversionRate(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return current / previous;
}

// ---------------------------------------------------------------------------
// Pipeline — funil de vendas
// ---------------------------------------------------------------------------

/** Ordem "feliz" do funil — ver CLAUDE.md → Status de Movimentação. */
export const FUNIL_PIPELINE: StatusMovimentacao[] = [
  "Não contatado",
  "Contatado",
  "Respondeu",
  "Em conversa",
  "Oportunidade identificada",
  "Orçamento encaminhado",
  "Parceria em andamento",
  "Parceiro ativo",
];

export const RESULTADOS_TERMINAIS_NEGATIVOS: StatusMovimentacao[] = ["Sem retorno", "Perdido"];

export interface EtapaFunil {
  status: StatusMovimentacao;
  quantidade: number;
  /** Conversão em relação à etapa anterior do funil (null na primeira etapa). */
  conversaoEtapaAnterior: number | null;
}

export function calcularFunilPipeline(leads: LeadPipeline[]): EtapaFunil[] {
  const contagem = groupCount(leads, (l) => l.status);
  let anterior: number | null = null;

  return FUNIL_PIPELINE.map((status) => {
    const quantidade = contagem[status] ?? 0;
    const conversaoEtapaAnterior = anterior === null ? null : conversionRate(quantidade, anterior);
    anterior = quantidade;
    return { status, quantidade, conversaoEtapaAnterior };
  });
}

export interface ResumoPipeline {
  total: number;
  porTemperatura: Record<string, number>;
  porEstado: Record<string, number>;
  porBaseDeOrigem: Record<string, number>;
  valorPotencialTotal: number;
  valorVendidoTotal: number;
  taxaDeGanho: number | null; // Parceiro ativo / (Parceiro ativo + Perdido + Sem retorno)
  leadsForaDoSla: number; // SLA Follow-up F5 sinalizado como fora do prazo
}

export function calcularResumoPipeline(leads: LeadPipeline[]): ResumoPipeline {
  const ganhos = leads.filter((l) => l.status === "Parceiro ativo").length;
  const perdidos = leads.filter((l) => RESULTADOS_TERMINAIS_NEGATIVOS.includes(l.status as StatusMovimentacao)).length;

  return {
    total: leads.length,
    porTemperatura: groupCount(leads, (l) => l.temperatura),
    porEstado: groupCount(leads, (l) => l.estado),
    porBaseDeOrigem: groupCount(leads, (l) => l.baseDeOrigem),
    valorPotencialTotal: sum(leads, (l) => l.valorPotencial),
    valorVendidoTotal: sum(leads, (l) => l.valorDaVenda),
    taxaDeGanho: conversionRate(ganhos, ganhos + perdidos),
    leadsForaDoSla: leads.filter(
      (l) => l.slaFollowUpF5 != null && /fora do sla|atrasad/i.test(l.slaFollowUpF5),
    ).length,
  };
}

// ---------------------------------------------------------------------------
// Scripts — ranking por taxa de resposta
// ---------------------------------------------------------------------------

export interface RankingScript {
  nomeDoScript: string;
  empresa: string | null;
  segmento: string | null;
  etapaDoFunil: string | null;
  status: string | null;
  leadsEnviados: number;
  respostasRecebidas: number;
  taxaDeResposta: number | null;
}

/** Ordena por taxa de resposta (a que já vem calculada no Notion) desc, scripts sem envio no fim. */
export function rankearScripts(scripts: ScriptWhatsapp[]): RankingScript[] {
  return scripts
    .map((s) => ({
      nomeDoScript: s.nomeDoScript,
      empresa: s.empresa,
      segmento: s.segmento,
      etapaDoFunil: s.etapaDoFunil,
      status: s.status,
      leadsEnviados: s.leadsEnviados ?? 0,
      respostasRecebidas: s.respostasRecebidas ?? 0,
      taxaDeResposta: s.taxaDeResposta,
    }))
    .sort((a, b) => (b.taxaDeResposta ?? -1) - (a.taxaDeResposta ?? -1));
}

export interface ResumoScripts {
  total: number;
  ativos: number;
  emTeste: number;
  taxaDeRespostaMedia: number | null;
  porEtapa: Record<string, number>;
}

export function calcularResumoScripts(scripts: ScriptWhatsapp[]): ResumoScripts {
  const comTaxa = scripts.filter((s) => s.taxaDeResposta != null);
  return {
    total: scripts.length,
    ativos: scripts.filter((s) => s.status === "Ativo").length,
    emTeste: scripts.filter((s) => s.status === "Em teste").length,
    taxaDeRespostaMedia:
      comTaxa.length === 0 ? null : sum(comTaxa, (s) => s.taxaDeResposta) / comTaxa.length,
    porEtapa: groupCount(scripts, (s) => s.etapaDoFunil),
  };
}

// ---------------------------------------------------------------------------
// Prospecções — cobertura do rodízio e mix de padrão/etapa
// ---------------------------------------------------------------------------

export interface ResumoProspeccoes {
  total: number;
  semNenhumaEmpresaContatou: number;
  porEtapaDaObra: Record<string, number>;
  porPadrao: Record<string, number>;
  mediaDeEmpresasPorLead: number;
}

export function calcularResumoProspeccoes(prospeccoes: Prospeccao[]): ResumoProspeccoes {
  return {
    total: prospeccoes.length,
    semNenhumaEmpresaContatou: prospeccoes.filter((p) => p.empresasQueJaContataram.length === 0)
      .length,
    porEtapaDaObra: groupCount(prospeccoes, (p) => p.etapaDaObra),
    porPadrao: groupCount(prospeccoes, (p) => p.padrao),
    mediaDeEmpresasPorLead:
      prospeccoes.length === 0
        ? 0
        : sum(prospeccoes, (p) => p.empresasQueJaContataram.length) / prospeccoes.length,
  };
}

// ---------------------------------------------------------------------------
// Profissionais — escada de relacionamento
// ---------------------------------------------------------------------------

export const ESCADA_RELACIONAMENTO = ["Não iniciado", "Em contato", "Ativo"] as const;

export function calcularFunilProfissionais(profissionais: Profissional[]) {
  const contagem = groupCount(profissionais, (p) => p.relacionamento);
  return ESCADA_RELACIONAMENTO.map((etapa) => ({ etapa, quantidade: contagem[etapa] ?? 0 }));
}

// ---------------------------------------------------------------------------
// Financeiro
// ---------------------------------------------------------------------------

export interface ResumoFinanceiro {
  receitaTotal: number;
  despesaTotal: number;
  saldo: number;
  pendentes: number;
  porCategoria: Record<string, number>;
}

export function calcularResumoFinanceiro(
  lancamentos: LancamentoFinanceiro[],
  estado?: "SE" | "BA" | "AL" | "Geral",
): ResumoFinanceiro {
  const filtrados = estado ? lancamentos.filter((l) => l.estado === estado) : lancamentos;
  const receitas = filtrados.filter((l) => l.tipo === "Receita");
  const despesas = filtrados.filter((l) => l.tipo === "Despesa");

  return {
    receitaTotal: sum(receitas, (l) => l.valor),
    despesaTotal: sum(despesas, (l) => l.valor),
    saldo: sum(receitas, (l) => l.valor) - sum(despesas, (l) => l.valor),
    pendentes: filtrados.filter((l) => l.status === "Pendente").length,
    porCategoria: groupCount(filtrados, (l) => l.categoria),
  };
}
