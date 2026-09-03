import { PageHeader } from "@/components/layout/page-header";

export default function ScriptsPage() {
  return (
    <>
      <PageHeader
        title="Scripts"
        description="Central de Scripts: taxa de resposta por Empresa x Segmento x Etapa (Agente 3 — Copywriting)."
      />
      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-500">
        Em construção — cada script é um experimento: nasce &quot;Em teste&quot;, vira
        &quot;Ativo&quot; ao bater a taxa de referência.
      </div>
    </>
  );
}
