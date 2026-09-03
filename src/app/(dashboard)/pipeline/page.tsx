import { PageHeader } from "@/components/layout/page-header";
import { StateTabs, ESTADOS_GERAL_SE_BA } from "@/components/layout/state-tabs";
import { Card } from "@/components/ui/card";
import { NotionErrorNotice } from "@/components/ui/notion-error-notice";
import { getPipelineLeads } from "@/lib/notion/pipeline";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Estado } from "@/lib/notion/client";

const TEMPERATURA_COLOR: Record<string, string> = {
  Quente: "bg-red-100 text-red-700",
  Morno: "bg-orange-100 text-orange-700",
  Frio: "bg-blue-100 text-blue-700",
};

export default async function PipelinePage({
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
          title="Pipeline"
          description="Controle Geral: leads por Estado, Temperatura, Score F5 e SLA de follow-up."
        />
        <StateTabs basePath="/pipeline" current={estado} options={ESTADOS_GERAL_SE_BA} />
        <NotionErrorNotice error={error} />
      </>
    );
  }

  const ordenados = [...leads].sort((a, b) => (b.scoreF5 ?? -1) - (a.scoreF5 ?? -1));

  return (
    <>
      <PageHeader
        title="Pipeline"
        description="Controle Geral: leads por Estado, Temperatura, Score F5 e SLA de follow-up. Priorizado por Score F5."
      />
      <StateTabs basePath="/pipeline" current={estado} options={ESTADOS_GERAL_SE_BA} />

      <Card title={`${formatNumber(leads.length)} leads`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                <th className="py-2 pr-4">Lead</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Temp.</th>
                <th className="py-2 pr-4">Base de origem</th>
                <th className="py-2 pr-4">Score F5</th>
                <th className="py-2 pr-4">SLA</th>
                <th className="py-2 pr-4">Próxima ação</th>
                <th className="py-2 pr-4 text-right">Valor potencial</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.slice(0, 100).map((lead) => (
                <tr key={lead.id} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2 pr-4">
                    <a href={lead.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {lead.nomeDoLead}
                    </a>
                  </td>
                  <td className="py-2 pr-4 text-neutral-600">{lead.status ?? "—"}</td>
                  <td className="py-2 pr-4">
                    {lead.temperatura && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${TEMPERATURA_COLOR[lead.temperatura] ?? "bg-neutral-100 text-neutral-600"}`}
                      >
                        {lead.temperatura}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-neutral-600">{lead.baseDeOrigem ?? "—"}</td>
                  <td className="py-2 pr-4 tabular-nums text-neutral-600">{lead.scoreF5 ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{lead.slaFollowUpF5 ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{lead.proximaAcao ?? "—"}</td>
                  <td className="py-2 pr-4 text-right tabular-nums text-neutral-600">
                    {lead.valorPotencial ? formatCurrency(lead.valorPotencial) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leads.length > 100 && (
          <p className="mt-3 text-xs text-neutral-400">
            Mostrando os 100 primeiros por Score F5 (de {formatNumber(leads.length)}). Filtros
            e paginação ficam pro próximo passo.
          </p>
        )}
      </Card>
    </>
  );
}
