import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHeader
        title="Configurações"
        description="Integração com o Notion, variáveis de ambiente e preferências do Portal."
      />

      <Card title="Notion">
        <p className="text-sm text-neutral-600">
          O Portal lê ao vivo do Notion — não guarda dado próprio. Só a chave de API é
          obrigatória; os IDs das bases (Dashboard Geral, Sergipe, Bahia) já estão
          configurados no código.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-neutral-600">
          <li>
            Crie uma integração interna em{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5">notion.so/my-integrations</code>.
          </li>
          <li>Compartilhe as páginas Dashboard Geral, Sergipe - SE e Bahia - BA com ela.</li>
          <li>
            Copie <code className="rounded bg-neutral-100 px-1 py-0.5">.env.example</code> para{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5">.env.local</code> e cole o token
            em <code className="rounded bg-neutral-100 px-1 py-0.5">NOTION_API_KEY</code>.
          </li>
        </ol>
      </Card>

      <Card title="Pendências conhecidas" className="mt-6">
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-600">
          <li>
            2 IDs de data source da Bahia (Profissionais e Rodízio de Disparo) ainda não
            foram confirmados — a página Relacionamento (BA) e o rodízio da Bahia vão
            mostrar erro até isso ser resolvido em{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5">src/lib/notion/client.ts</code>.
          </li>
          <li>Alagoas (AL) ainda não tem página própria no Notion — só aparece como opção do campo Estado nas bases consolidadas.</li>
        </ul>
      </Card>
    </>
  );
}
