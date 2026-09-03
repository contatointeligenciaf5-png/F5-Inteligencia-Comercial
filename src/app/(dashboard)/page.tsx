import { PageHeader } from "@/components/layout/page-header";
import { StateTabs, ESTADOS_GERAL_SE_BA } from "@/components/layout/state-tabs";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { BarList } from "@/components/ui/bar-list";
import { NotionErrorNotice } from "@/components/ui/notion-error-notice";
import { getPipelineLeads } from "@/lib/notion/pipeline";
import { calcularFunilPipeline, calcularResumoPipeline } from "@/lib/notion/analytics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { Estado } from "@/lib/notion/client";

export default async function VisaoGeralPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoParam } = await searchParams;
  const estado = (estadoParam as Estado | "Geral") ?? "Geral";

  let leads;
  try {
    leads = await getPipelineLeads(estado);
  } catch (error) {
    return (
      <>
        <PageHeader
          title="Visão Geral"
          description="KPIs consolidados, funil e forecast (Agente 15 — BI e Relatórios)."
        />
        <StateTabs basePath="/" current={estado} options={ESTADOS_GERAL_SE_BA} />
        <NotionErrorNotice error={error} />
      </>
    );
  }

  const resumo = calcularResumoPipeline(leads);
  const funil = calcularFunilPipeline(leads);

  return (
    <>
      <PageHeader
        title="Visão Geral"
        description="KPIs consolidados, funil e forecast (Agente 15 — BI e Relatórios)."
      />
      <StateTabs basePath="/" current={estado} options={ESTADOS_GERAL_SE_BA} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Leads no pipeline" value={formatNumber(resumo.total)} />
        <StatCard label="Valor potencial" value={formatCurrency(resumo.valorPotencialTotal)} />
        <StatCard label="Valor vendido" value={formatCurrency(resumo.valorVendidoTotal)} />
        <StatCard label="Taxa de ganho" value={formatPercent(resumo.taxaDeGanho)} hint="Parceiro ativo ÷ (ativo + perdido + sem retorno)" />
        <StatCard label="Fora do SLA" value={formatNumber(resumo.leadsForaDoSla)} hint="Follow-up atrasado" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Funil de vendas (Status de Movimentação)">
          <BarList
            items={funil.map((etapa) => ({ label: etapa.status, value: etapa.quantidade }))}
          />
        </Card>

        <Card title="Temperatura">
          <BarList
            items={Object.entries(resumo.porTemperatura).map(([label, value]) => ({
              label,
              value,
            }))}
          />
        </Card>

        {estado === "Geral" && (
          <Card title="Por Estado">
            <BarList
              items={Object.entries(resumo.porEstado).map(([label, value]) => ({ label, value }))}
            />
          </Card>
        )}

        <Card title="Por loja parceira (Base de origem)">
          <BarList
            items={Object.entries(resumo.porBaseDeOrigem)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([label, value]) => ({ label, value }))}
          />
        </Card>
      </div>
    </>
  );
}
