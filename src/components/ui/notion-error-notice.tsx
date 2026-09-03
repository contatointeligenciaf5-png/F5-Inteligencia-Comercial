export function NotionErrorNotice({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-medium">Não foi possível buscar os dados do Notion.</p>
      <p className="mt-1 text-amber-700">{message}</p>
      <p className="mt-2 text-amber-700">
        Confira o <code className="rounded bg-amber-100 px-1 py-0.5">.env.local</code> (copie de{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5">.env.example</code>) e se a
        integração do Notion tem acesso à base.
      </p>
    </div>
  );
}
