import { PageHeader } from "@/components/layout/page-header";

export default function FinanceiroPage() {
  return (
    <>
      <PageHeader
        title="Financeiro"
        description="Comissões provisionadas x recebidas, repasses por loja (Agente 16 — Financeiro e Comissões)."
      />
      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-500">
        Em construção — lembrar sempre: venda fechada = 3 registros (CRM + Lançamento
        Financeiro com valor de COMISSÃO, nunca o valor total da venda + confirmação em
        Comissões por Empresa).
      </div>
    </>
  );
}
