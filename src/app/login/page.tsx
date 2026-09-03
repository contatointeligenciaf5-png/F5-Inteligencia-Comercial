export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-neutral-900">Portal F5</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Inteligência Comercial — acesso restrito.
        </p>

        <form action="/api/login" method="POST" className="mt-6 space-y-4">
          {from && <input type="hidden" name="from" value={from} />}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-neutral-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">Senha incorreta. Tente novamente.</p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
