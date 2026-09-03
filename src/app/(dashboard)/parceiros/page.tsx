import { PageHeader } from "@/components/layout/page-header";

export default function ParceirosPage() {
  return (
    <>
      <PageHeader
        title="Parceiros"
        description="Lojas parceiras (base de origem), scorecard, contratos e % de comissão (Agente 12 — Parcerias e CS)."
      />
      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-500">
        Em construção — lista das lojas parceiras (Vidro X, Balconi, Fonseca Shop, Granart
        etc.), leads gerados, taxa de conversão e status de contrato.
      </div>
    </>
  );
}
