import { PageHeader } from "@/components/layout/page-header";
import { StateTabs, ESTADOS_SE_BA } from "@/components/layout/state-tabs";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { BarList } from "@/components/ui/bar-list";
import { NotionErrorNotice } from "@/components/ui/notion-error-notice";
import { getProspeccoes } from "@/lib/notion/prospeccoes";
import { calcularResumoProspeccoes } from "@/lib/notion/analytics";
import { formatNumber } from "@/lib/utils";
import type { Estado } from "@/lib/notion/client";

export default async function ProspeccaoPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoParam } = await searchParams;
  const estado = (estadoParam as Estado) ?? "SE";

  let prospeccoes;
  try {
    prospeccoes = await getProspeccoes(estado);
  } catch (error) {
    return (
      <>
        <PageHeader
          title="Prospecção"
          description="Prospecções de campo: obras e condomínios, rodízio entre lojas (Agente 1 — Prospecção em Campo)."
        />
        <StateTabs basePath="/prospeccao" current={estado} options={ESTADOS_SE_BA} />
        <NotionErrorNotice error={error} />
      </>
    );
  }

  const resumo = calcularResumoProspeccoes(prospeccoes);

  return (
    <>
      <PageHeader
        title="Prospecção"
        description="Prospecções de campo: obras e condomínios, rodízio entre lojas (Agente 1 — Prospecção em Campo)."
      />
      <StateTabs basePath="/prospeccao" current={estado} options={ESTADOS_SE_BA} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Prospecções" value={formatNumber(resumo.total)} />
        <StatCard
          label="Sem nenhuma loja contatou"
          value={formatNumber(resumo.semNenhumaEmpresaContatou)}
          hint="Fila pronta pro disparo"
        />
        <StatCard
          label="Média de lojas por lead"
          value={resumo.mediaDeEmpresasPorLead.toFixed(1)}
          hint="Cobertura do rodízio"
        />
        <StatCard
          label="Padrão Alto"
          value={formatNumber(resumo.porPadrao["Alto"] ?? 0)}
          hint={`de ${formatNumber(resumo.total)} — priorizar`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Por etapa da obra">
          <BarList
            items={Object.entries(resumo.porEtapaDaObra).map(([label, value]) => ({
              label,
              value,
            }))}
          />
        </Card>
        <Card title="Por padrão">
          <BarList
            items={Object.entries(resumo.porPadrao).map(([label, value]) => ({ label, value }))}
          />
        </Card>
      </div>

      <Card title={`Lista (${formatNumber(prospeccoes.length)})`} className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                <th className="py-2 pr-4">Proprietário</th>
                <th className="py-2 pr-4">Condomínio</th>
                <th className="py-2 pr-4">Etapa da obra</th>
                <th className="py-2 pr-4">Padrão</th>
                <th className="py-2 pr-4">Loja da vez</th>
                <th className="py-2 pr-4">Lojas que já contataram</th>
              </tr>
            </thead>
            <tbody>
              {prospeccoes.slice(0, 100).map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2 pr-4">
                    <a href={p.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {p.proprietario}
                    </a>
                  </td>
                  <td className="py-2 pr-4 text-neutral-600">{p.condominio ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{p.etapaDaObra ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{p.padrao ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{p.lojaDaVez ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">
                    {p.empresasQueJaContataram.length > 0
                      ? p.empresasQueJaContataram.join(", ")
                      : "—"}
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
