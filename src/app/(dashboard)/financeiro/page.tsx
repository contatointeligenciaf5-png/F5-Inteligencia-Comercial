import { PageHeader } from "@/components/layout/page-header";
import { StateTabs, ESTADOS_GERAL_SE_BA } from "@/components/layout/state-tabs";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { BarList } from "@/components/ui/bar-list";
import { NotionErrorNotice } from "@/components/ui/notion-error-notice";
import { getLancamentosFinanceiros } from "@/lib/notion/financeiro";
import { getComissoesPorEmpresa } from "@/lib/notion/comissoes";
import { calcularResumoFinanceiro } from "@/lib/notion/analytics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { Estado } from "@/lib/notion/client";

const STATUS_CONTRATO_COLOR: Record<string, string> = {
  Ativo: "bg-green-100 text-green-700",
  "Pendente negociação": "bg-yellow-100 text-yellow-700",
  "Não fechado": "bg-red-100 text-red-700",
};

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoParam } = await searchParams;
  const estado = (estadoParam as Estado | "Geral") ?? "Geral";

  let lancamentos, comissoes;
  try {
    [lancamentos, comissoes] = await Promise.all([
      getLancamentosFinanceiros(),
      getComissoesPorEmpresa(),
    ]);
  } catch (error) {
    return (
      <>
        <PageHeader
          title="Financeiro"
          description="Lançamentos e comissões por empresa (Agente 16 — Financeiro e Comissões)."
        />
        <StateTabs basePath="/financeiro" current={estado} options={ESTADOS_GERAL_SE_BA} />
        <NotionErrorNotice error={error} />
      </>
    );
  }

  const resumo = calcularResumoFinanceiro(lancamentos, estado === "Geral" ? undefined : estado);

  return (
    <>
      <PageHeader
        title="Financeiro"
        description="Lançamentos (receita/despesa) e comissões por empresa. Lembrete do Agente 16: venda fechada = 3 registros, valor de comissão nunca é o valor total da venda."
      />
      <StateTabs basePath="/financeiro" current={estado} options={ESTADOS_GERAL_SE_BA} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Receita" value={formatCurrency(resumo.receitaTotal)} />
        <StatCard label="Despesa" value={formatCurrency(resumo.despesaTotal)} />
        <StatCard label="Saldo" value={formatCurrency(resumo.saldo)} />
        <StatCard label="Lançamentos pendentes" value={formatNumber(resumo.pendentes)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Por categoria">
          <BarList
            items={Object.entries(resumo.porCategoria).map(([label, value]) => ({
              label,
              value,
            }))}
          />
        </Card>

        <Card title="Comissões por Empresa">
          <div className="space-y-3">
            {comissoes.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <div>
                  <a href={c.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                    {c.empresa}
                  </a>
                  <p className="text-xs text-neutral-400">{c.tipoDeComissao ?? "—"}</p>
                </div>
                <div className="text-right">
                  <p className="tabular-nums">
                    {c.tipoDeComissao === "Fixo mensal" && c.valorFixoMensal
                      ? formatCurrency(c.valorFixoMensal)
                      : formatPercent(c.percentual, 1)}
                  </p>
                  {c.statusDoContrato && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CONTRATO_COLOR[c.statusDoContrato] ?? "bg-neutral-100 text-neutral-600"}`}
                    >
                      {c.statusDoContrato}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
