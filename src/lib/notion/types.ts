/**
 * Tipos espelhando o schema real da base "Controle Geral" no Notion
 * (data source b9b37e33-5c8c-45d3-82b3-d42c46d7e66e).
 * Ver CLAUDE.md → "Modelo de dados" para a lista completa de propriedades.
 */

export type Estado = "BA" | "SE" | "AL";

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

export type Origem = "Condomínio" | "Indicação" | "Arquiteto" | "Base antiga";

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
  origem: Origem | null;
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
