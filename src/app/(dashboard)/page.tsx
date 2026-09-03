import { PageHeader } from "@/components/layout/page-header";

export default function VisaoGeralPage() {
  return (
    <>
      <PageHeader
        title="Visão Geral"
        description="KPIs consolidados, funil e forecast (Agente 15 — BI e Relatórios)."
      />
      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-500">
        Em construção — próximo passo: puxar os leads da base{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5">Controle Geral</code> via{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5">getPipelineLeads()</code> (
        <code className="rounded bg-neutral-100 px-1 py-0.5">src/lib/notion/pipeline.ts</code>)
        e montar os cards de funil por Estado, Temperatura e Status.
      </div>
    </>
  );
}
