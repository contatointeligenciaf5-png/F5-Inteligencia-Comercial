import { PageHeader } from "@/components/layout/page-header";

export default function PipelinePage() {
  return (
    <>
      <PageHeader
        title="Pipeline"
        description="Base Controle Geral: leads por Estado (SE/BA/AL), Temperatura, Score F5 e SLA de follow-up."
      />
      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-500">
        Em construção — tabela/kanban por{" "}
        <code className="rounded bg-neutral-100 px-1 py-0.5">Status de Movimentação</code>{" "}
        (Não contatado → Contatado → Respondeu → Em conversa → Oportunidade identificada →
        Orçamento encaminhado → Parceria em andamento → Parceiro ativo | Sem retorno | Perdido).
      </div>
    </>
  );
}
