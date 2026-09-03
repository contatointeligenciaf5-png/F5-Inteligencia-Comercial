# Portal F5 — Inteligência Comercial

Dashboard interno da F5 Inteligência Comercial, conectado à API do Notion.
Ver [`CLAUDE.md`](./CLAUDE.md) para o contexto completo do negócio, a stack e a
estrutura do projeto.

## Desenvolvimento

```bash
pnpm install
cp .env.example .env.local   # preencha os valores (Notion + auth)
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — servidor de desenvolvimento
- `pnpm build` — build de produção
- `pnpm start` — roda o build de produção
- `pnpm lint` — ESLint

## Deploy

Hospedado na [Vercel](https://vercel.com). Configure as mesmas variáveis de
`.env.example` no painel do projeto (Settings → Environment Variables).
