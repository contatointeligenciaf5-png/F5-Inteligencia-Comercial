/**
 * Tipos espelhando o schema real das bases do ecossistema F5 no Notion
 * (consultado em 2026-09-03). Ver CLAUDE.md → "Mapa do ecossistema Notion" para a
 * árvore completa e a base de cada tipo.
 */

export type Estado = "BA" | "SE" | "AL";

// ---------------------------------------------------------------------------
// Controle Geral (pipeline / CRM)
// ---------------------------------------------------------------------------

export type StatusMovimentacao =
  | "Não contatado"
  | "Contatado"
  | "Respondeu"
  | "Em conversa"
  | "Relacionamento aberto"
  | "Oportunidade identificada"
  | "Orçamento encaminhado"
  | "Parceria em andamento"
  | "Parceiro ativo"
  | "Sem retorno"
  | "Perdido";

export type Temperatura = "Quente" | "Morno" | "Frio";

export type TipoLead = "Cliente" | "Arquiteto" | "Engenheiro";

export type SituacaoLead =
  | "Tem obra ativa"
  | "Em decisão"
  | "Só relacionamento"
  | "Medição/Analise Técnica";

export type OrigemLead = "Condomínio" | "Indicação" | "Arquiteto" | "Base antiga";

export type Canal = "Oportunidade F5" | "Portfólio Loja" | "Outro";

export interface LeadPipeline {
  id: string;
  url: string;
  nomeDoLead: string;
  estado: Estado | null;
  baseDeOrigem: string | null;
  status: StatusMovimentacao | null;
  temperatura: Temperatura | null;
  tipo: TipoLead | null;
  situacaoDoLead: SituacaoLead | null;
  origem: OrigemLead | null;
  canal: Canal | null;
  arquiteto: string | null;
  proximaAcao: string | null;
  observacoes: string | null;
  valorPotencial: number | null;
  valorDaVenda: number | null;
  comissaoPercentual: number | null;
  dataDoContato: string | null;
  dataDoProximoContato: string | null;
  ultimaInteracao: string | null;
  /** Formulas calculadas no Notion (somente leitura). */
  scoreF5: number | null;
  diasSemInteracao: number | null;
  slaFollowUpF5: string | null;
}

// ---------------------------------------------------------------------------
// Central de Scripts
// ---------------------------------------------------------------------------

export type StatusScript = "Em teste" | "Ativo" | "Descontinuado";

export type EtapaFunilScript = "Abordagem inicial" | "Follow-up" | "Reativação" | "Fechamento";

export interface ScriptWhatsapp {
  id: string;
  url: string;
  nomeDoScript: string;
  empresa: string | null;
  segmento: string | null;
  etapaDoFunil: EtapaFunilScript | null;
  status: StatusScript | null;
  leadsEnviados: number | null;
  respostasRecebidas: number | null;
  taxaDeResposta: number | null;
  versao: number | null;
  dataDeCriacao: string | null;
  dataDoUltimoDisparo: string | null;
  observacoes: string | null;
}

// ---------------------------------------------------------------------------
// Prospecções
// ---------------------------------------------------------------------------

export type EtapaObra = "Fundação" | "Estrutura" | "Alvenaria" | "Pilares" | "Acabamento";

export type PadraoObra = "Alto" | "Médio";

export interface Prospeccao {
  id: string;
  url: string;
  proprietario: string;
  estado: Estado | null;
  etapaDaObra: EtapaObra | null;
  padrao: PadraoObra | null;
  condominio: string | null;
  enderecoLote: string | null;
  arquiteto: string | null;
  engenheiro: string | null;
  mestreDeObras: string | null;
  empresasQueJaContataram: string[];
  lojaDaVez: string | null;
  ultimoDisparo: string | null;
  dataDaProspeccao: string | null;
}

// ---------------------------------------------------------------------------
// Profissionais (relacionamento)
// ---------------------------------------------------------------------------

export type TipoProfissional = "Arquiteto" | "Engenheiro" | "Construtora";

export type EscadaRelacionamento = "Não iniciado" | "Em contato" | "Ativo";

export interface Profissional {
  id: string;
  url: string;
  nome: string;
  tipo: TipoProfissional | null;
  relacionamento: EscadaRelacionamento | null;
  empresaOuEscritorio: string | null;
  contato: string | null;
  estado: Estado | null;
  observacoes: string | null;
}

// ---------------------------------------------------------------------------
// Comissões por Empresa
// ---------------------------------------------------------------------------

export type StatusContrato = "Ativo" | "Pendente negociação" | "Não fechado";

export type TipoComissao = "Percentual" | "Fixo mensal" | "A negociar";

export interface ComissaoEmpresa {
  id: string;
  url: string;
  empresa: string;
  statusDoContrato: StatusContrato | null;
  tipoDeComissao: TipoComissao | null;
  percentual: number | null;
  valorFixoMensal: number | null;
  observacoes: string | null;
}

// ---------------------------------------------------------------------------
// Lançamentos Financeiros
// ---------------------------------------------------------------------------

export type TipoLancamento = "Receita" | "Despesa";

export type CategoriaLancamento =
  | "Vendas"
  | "Impostos"
  | "Folha"
  | "Marketing"
  | "Operacional"
  | "Outros";

export type CentroDeCusto = "Loja" | "Obras" | "Administrativo";

export type StatusLancamento = "Pendente" | "Pago/Recebido";

export interface LancamentoFinanceiro {
  id: string;
  url: string;
  descricao: string;
  tipo: TipoLancamento | null;
  categoria: CategoriaLancamento | null;
  centroDeCusto: CentroDeCusto | null;
  estado: Estado | "Geral" | null;
  valor: number | null;
  status: StatusLancamento | null;
  competencia: string | null;
  dataDeVencimento: string | null;
  dataDePagamentoRecebimento: string | null;
  clienteFornecedor: string | null;
}

// ---------------------------------------------------------------------------
// Movimentação / Rodízio de Disparo
// ---------------------------------------------------------------------------

export type StatusLoteDisparo = "Não iniciada" | "Em andamento" | "Concluído";

export interface LoteDisparo {
  id: string;
  url: string;
  nomeDoDisparo: string;
  empresa: string | null;
  segmento: string | null;
  quantidadeDeLeads: number | null;
  status: StatusLoteDisparo | null;
  ciclo: number | null;
  dataDeDisparo: string | null;
  dataDeDescansoLiberacao: string | null;
}

// ---------------------------------------------------------------------------
// Insights F5 / Inovação
// ---------------------------------------------------------------------------

export type TipoInsight = "Gargalo" | "Oportunidade" | "Padrao observado" | "Ideia de inovacao";

export type StatusInsight =
  | "Novo"
  | "Em analise"
  | "Validado - aguardando momento certo"
  | "Aplicado"
  | "Descartado";

export interface Insight {
  id: string;
  url: string;
  insight: string;
  tipo: TipoInsight | null;
  agenteDeOrigem: string | null;
  status: StatusInsight | null;
  descricao: string | null;
  dadoDeSuporte: string | null;
  data: string | null;
}
