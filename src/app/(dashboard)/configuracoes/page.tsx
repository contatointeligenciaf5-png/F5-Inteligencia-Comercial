import { PageHeader } from "@/components/layout/page-header";

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHeader
        title="Configurações"
        description="Integração com o Notion, variáveis de ambiente e preferências do Portal."
      />
      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-500">
        Em construção — ver <code className="rounded bg-neutral-100 px-1 py-0.5">.env.example</code>{" "}
        para as variáveis necessárias (NOTION_API_KEY, IDs das data sources, AUTH_*).
      </div>
    </>
  );
}
