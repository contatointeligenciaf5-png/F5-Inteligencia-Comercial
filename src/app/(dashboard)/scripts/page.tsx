import { PageHeader } from "@/components/layout/page-header";
import { StateTabs, ESTADOS_SE_BA } from "@/components/layout/state-tabs";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { NotionErrorNotice } from "@/components/ui/notion-error-notice";
import { getScripts } from "@/lib/notion/scripts";
import { calcularResumoScripts, rankearScripts } from "@/lib/notion/analytics";
import { formatNumber } from "@/lib/utils";
import type { Estado } from "@/lib/notion/client";

const STATUS_COLOR: Record<string, string> = {
  Ativo: "bg-green-100 text-green-700",
  "Em teste": "bg-yellow-100 text-yellow-700",
  Descontinuado: "bg-neutral-100 text-neutral-500",
};

export default async function ScriptsPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoParam } = await searchParams;
  const estado = (estadoParam as Estado) ?? "SE";

  let scripts;
  try {
    scripts = await getScripts(estado);
  } catch (error) {
    return (
      <>
        <PageHeader
          title="Scripts"
          description="Central de Scripts: taxa de resposta por Empresa x Segmento x Etapa (Agente 3 — Copywriting)."
        />
        <StateTabs basePath="/scripts" current={estado} options={ESTADOS_SE_BA} />
        <NotionErrorNotice error={error} />
      </>
    );
  }

  const resumo = calcularResumoScripts(scripts);
  const ranking = rankearScripts(scripts);

  return (
    <>
      <PageHeader
        title="Scripts"
        description="Central de Scripts: cada script nasce “Em teste” e vira “Ativo” ao bater a taxa de referência (Agente 3 — Copywriting)."
      />
      <StateTabs basePath="/scripts" current={estado} options={ESTADOS_SE_BA} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Scripts" value={formatNumber(resumo.total)} />
        <StatCard label="Ativos" value={formatNumber(resumo.ativos)} />
        <StatCard label="Em teste" value={formatNumber(resumo.emTeste)} />
        <StatCard
          label="Taxa de resposta média"
          value={resumo.taxaDeRespostaMedia == null ? "—" : `${resumo.taxaDeRespostaMedia.toFixed(1)}%`}
        />
      </div>

      <Card title="Ranking por taxa de resposta" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                <th className="py-2 pr-4">Script</th>
                <th className="py-2 pr-4">Empresa</th>
                <th className="py-2 pr-4">Segmento</th>
                <th className="py-2 pr-4">Etapa</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4 text-right">Enviados</th>
                <th className="py-2 pr-4 text-right">Respostas</th>
                <th className="py-2 pr-4 text-right">Taxa</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((s) => (
                <tr key={s.nomeDoScript} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2 pr-4">{s.nomeDoScript}</td>
                  <td className="py-2 pr-4 text-neutral-600">{s.empresa ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{s.segmento ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{s.etapaDoFunil ?? "—"}</td>
                  <td className="py-2 pr-4">
                    {s.status && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[s.status] ?? "bg-neutral-100 text-neutral-600"}`}
                      >
                        {s.status}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-neutral-600">
                    {formatNumber(s.leadsEnviados)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-neutral-600">
                    {formatNumber(s.respostasRecebidas)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums font-medium text-neutral-900">
                    {s.taxaDeResposta == null ? "—" : `${s.taxaDeResposta}%`}
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
