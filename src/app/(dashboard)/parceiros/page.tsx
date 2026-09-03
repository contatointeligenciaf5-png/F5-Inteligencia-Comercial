import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { NotionErrorNotice } from "@/components/ui/notion-error-notice";
import { getPipelineLeads } from "@/lib/notion/pipeline";
import { getComissoesPorEmpresa } from "@/lib/notion/comissoes";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

const STATUS_CONTRATO_COLOR: Record<string, string> = {
  Ativo: "bg-green-100 text-green-700",
  "Pendente negociação": "bg-yellow-100 text-yellow-700",
  "Não fechado": "bg-red-100 text-red-700",
};

export default async function ParceirosPage() {
  let leads, comissoes;
  try {
    [leads, comissoes] = await Promise.all([getPipelineLeads("Geral"), getComissoesPorEmpresa()]);
  } catch (error) {
    return (
      <>
        <PageHeader
          title="Parceiros"
          description="Lojas parceiras: leads, conversão e status de contrato (Agente 12 — Parcerias e CS)."
        />
        <NotionErrorNotice error={error} />
      </>
    );
  }

  const comissaoPorEmpresa = new Map(comissoes.map((c) => [c.empresa, c]));
  const lojas = new Set([...comissoes.map((c) => c.empresa), ...leads.map((l) => l.baseDeOrigem).filter((v): v is string => !!v)]);

  const linhas = [...lojas]
    .map((loja) => {
      const leadsDaLoja = leads.filter((l) => l.baseDeOrigem === loja);
      const ativos = leadsDaLoja.filter((l) => l.status === "Parceiro ativo").length;
      const perdidos = leadsDaLoja.filter((l) => l.status === "Perdido" || l.status === "Sem retorno").length;
      const conversao = leadsDaLoja.length === 0 ? null : ativos / leadsDaLoja.length;
      return {
        loja,
        totalLeads: leadsDaLoja.length,
        ativos,
        perdidos,
        conversao,
        valorPotencial: leadsDaLoja.reduce((acc, l) => acc + (l.valorPotencial ?? 0), 0),
        comissao: comissaoPorEmpresa.get(loja) ?? null,
      };
    })
    .sort((a, b) => b.totalLeads - a.totalLeads);

  return (
    <>
      <PageHeader
        title="Parceiros"
        description="Cruza o pipeline (Base de origem) com Comissões por Empresa — leads gerados, conversão e status de contrato por loja (Agente 12 — Parcerias e CS)."
      />

      <Card title={`${formatNumber(linhas.length)} lojas parceiras`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                <th className="py-2 pr-4">Loja</th>
                <th className="py-2 pr-4">Contrato</th>
                <th className="py-2 pr-4">Comissão</th>
                <th className="py-2 pr-4 text-right">Leads</th>
                <th className="py-2 pr-4 text-right">Parceiro ativo</th>
                <th className="py-2 pr-4 text-right">Perdidos</th>
                <th className="py-2 pr-4 text-right">Conversão</th>
                <th className="py-2 pr-4 text-right">Valor potencial</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha) => (
                <tr key={linha.loja} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2 pr-4 font-medium">{linha.loja}</td>
                  <td className="py-2 pr-4">
                    {linha.comissao?.statusDoContrato ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CONTRATO_COLOR[linha.comissao.statusDoContrato] ?? "bg-neutral-100 text-neutral-600"}`}
                      >
                        {linha.comissao.statusDoContrato}
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-neutral-600">
                    {linha.comissao?.tipoDeComissao === "Fixo mensal" && linha.comissao.valorFixoMensal
                      ? formatCurrency(linha.comissao.valorFixoMensal)
                      : formatPercent(linha.comissao?.percentual ?? null, 1)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-neutral-600">
                    {formatNumber(linha.totalLeads)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-neutral-600">
                    {formatNumber(linha.ativos)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-neutral-600">
                    {formatNumber(linha.perdidos)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums font-medium text-neutral-900">
                    {formatPercent(linha.conversao)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-neutral-600">
                    {formatCurrency(linha.valorPotencial)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
