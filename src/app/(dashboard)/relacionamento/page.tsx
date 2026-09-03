import { PageHeader } from "@/components/layout/page-header";
import { StateTabs, ESTADOS_SE_BA } from "@/components/layout/state-tabs";
import { Card } from "@/components/ui/card";
import { BarList } from "@/components/ui/bar-list";
import { NotionErrorNotice } from "@/components/ui/notion-error-notice";
import { getProfissionais } from "@/lib/notion/profissionais";
import { calcularFunilProfissionais, groupCount } from "@/lib/notion/analytics";
import { formatNumber } from "@/lib/utils";
import type { Estado } from "@/lib/notion/client";

export default async function RelacionamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoParam } = await searchParams;
  const estado = (estadoParam as Estado) ?? "SE";

  let profissionais;
  try {
    profissionais = await getProfissionais(estado);
  } catch (error) {
    return (
      <>
        <PageHeader
          title="Relacionamento"
          description="Rede de arquitetos, engenheiros e construtoras (Agente 2 — Relacionamento com Profissionais)."
        />
        <StateTabs basePath="/relacionamento" current={estado} options={ESTADOS_SE_BA} />
        <NotionErrorNotice error={error} />
      </>
    );
  }

  const funil = calcularFunilProfissionais(profissionais);
  const porTipo = groupCount(profissionais, (p) => p.tipo);

  return (
    <>
      <PageHeader
        title="Relacionamento"
        description="Rede de arquitetos, engenheiros e construtoras — escada Não iniciado → Em contato → Ativo (Agente 2)."
      />
      <StateTabs basePath="/relacionamento" current={estado} options={ESTADOS_SE_BA} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Escada de relacionamento">
          <BarList items={funil.map((f) => ({ label: f.etapa, value: f.quantidade }))} />
        </Card>
        <Card title="Por tipo">
          <BarList items={Object.entries(porTipo).map(([label, value]) => ({ label, value }))} />
        </Card>
      </div>

      <Card title={`Lista (${formatNumber(profissionais.length)})`} className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Empresa/Escritório</th>
                <th className="py-2 pr-4">Relacionamento</th>
                <th className="py-2 pr-4">Contato</th>
              </tr>
            </thead>
            <tbody>
              {profissionais.slice(0, 150).map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2 pr-4">
                    <a href={p.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {p.nome}
                    </a>
                  </td>
                  <td className="py-2 pr-4 text-neutral-600">{p.tipo ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{p.empresaOuEscritorio ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{p.relacionamento ?? "—"}</td>
                  <td className="py-2 pr-4 text-neutral-600">{p.contato ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
