# Portal F5 — Inteligência Comercial

Contexto para trabalhar neste repositório. Leia isto antes de programar.

> Ver também `@AGENTS.md` — avisos de breaking changes desta versão do Next.js
> (regenerado automaticamente por `next dev`, não editar manualmente).

## O que é a F5

A F5 Inteligência Comercial é o **braço comercial terceirizado** de lojas de material de
construção/acabamento (vidraçarias, marmorarias, madeireiras, tintas, elétrica, automação
etc.) nos estados de **SE, BA e AL**. O método foi validado com a loja **Vidro X** e está
sendo replicado para dezenas de lojas parceiras (hoje ~10-14 lojas ativas, ex.: Balconi,
Fonseca Shop, Feira Tintas, Granart, Home Life, Home Design, Elettromec, Input Automação,
Marmoraria Fernandes, EP Elétrica, Itamad Planejados, Itabaiana Madeiras).

**Como a F5 ganha dinheiro:** capta e qualifica leads (obras em andamento, condomínios,
arquitetos/engenheiros/construtoras), conduz o processo comercial (prospecção → disparo
WhatsApp → qualificação → negociação → fechamento) e cobra **comissão sobre as vendas
geradas** para as lojas parceiras. Cada venda fechada gera 3 registros: atualização do
CRM, lançamento financeiro (valor = **comissão**, nunca o valor total da venda) e
confirmação em "Comissões por Empresa".

Dono da operação: **Fellipe** (contato.inteligenciaf5@gmail.com). Hoje é praticamente uma
operação de uma pessoa só, orquestrando um sistema de **22 agentes de IA** (ver abaixo) que
rodam em cima de bases no Notion — o Portal é o próximo passo para ter uma camada visual
e mais rápida sobre esses mesmos dados.

### Regras de negócio invioláveis

- **Regra dos 3 dias**: não disparar para um lead se outra loja já contatou há menos de 3
  dias. Rodízio entre lojas é sempre registrado.
- **Quente primeiro**: resposta e follow-up vencido de lead quente vêm antes de disparo frio.
- **Base limpa antes de volume**: higiene de dados (duplicados, campos faltando, LGPD/opt-in)
  antes de disparo em escala.
- **Nada sem próximo passo.** Todo lead/oportunidade tem uma próxima ação e data.
- **Venda fechada = 3 registros** (CRM + Financeiro com valor de comissão + confirmação em
  Comissões por Empresa). Comissão *provisionada* ≠ comissão *recebida*.
- **Só replica o que o BI validou.** Padrão > processo sob medida (pensar em dezenas de lojas).
- **Tom de voz F5** (scripts/mensagens): sem emoji, profissional e assertivo, nunca inventa
  preço/prazo sem confirmação.
- **Nunca expor o método ou números reais da F5** publicamente (ex.: Instagram
  @inteligenciaf5). Isso vale também para este repositório se ele algum dia for público —
  hoje é privado e deve continuar assim.

### O sistema de 22 agentes (hub-and-spoke)

Hoje a operação roda como agentes de IA no Notion/Claude, todos orbitando um **Agente
Principal (Maestro/Roteador)**: Fellipe fala só com o Principal, que despacha para o
agente certo e encadeia handoffs. Grupos relevantes para o Portal:

| Fase | Agentes |
|---|---|
| Captação | Prospecção em Campo, Relacionamento com Profissionais |
| Ativação | Copywriting & Scripts, Disparo/Outbound |
| Funil | Qualificação & Pipeline, SLA em Tempo Real, Operador/Resgate, Coaching de SDR |
| Fechamento | Negociação & Fechamento |
| Pós-venda | Pós-Venda & NPS, Cross-Sell |
| Operação | Parcerias & CS, Sincronização Geral, Qualidade & LGPD, Padronização |
| Gestão | BI & Relatórios, Financeiro & Comissões, Onboarding & Método, Inovação &
  Benchmark, Estratégia Comercial, Marketing & Conteúdo, Backup & Arquivo |

O **Portal não substitui esses agentes** — eles continuam operando via Notion/chat. O
Portal é a camada de **visualização e consulta rápida** sobre os dados que esses agentes
já mantêm atualizados no Notion (e, eventualmente, ações simples de escrita).

## O Portal (este projeto)

Dashboard web interno que **complementa o Notion** (não substitui — o Notion continua
sendo o sistema de registro/fonte de verdade operada pelos agentes). O Portal existe para:

1. Dar visão executiva rápida (KPIs, funil, forecast) sem abrir o Notion.
2. Consolidar visualizações que o Notion faz mal em views nativas (dashboards cruzando
   várias bases, gráficos, séries temporais).
3. Servir de base para futuras ações (ex.: marcar follow-up feito) direto do Portal.

Uso interno, poucos usuários (hoje: só o Fellipe; pode crescer para a equipe). **Não é
um produto para as lojas parceiras acessarem** (a menos que isso mude explicitamente).

### Stack escolhida

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4** — full-stack em um único
  projeto, Server Components para buscar dados do Notion no servidor (o token da API
  nunca deve chegar ao browser), deploy trivial.
- **Vercel** para hospedar — zero-config com Next.js, HTTPS grátis, preview deploys por
  branch/PR. É o caminho mais simples e foi a escolha confirmada.
- **@notionhq/client** (SDK oficial) para ler/escrever no Notion. A API do Notion hoje
  (versão `2025-09-03`) separa **database** (container) de **data source** (a tabela em
  si) — sempre use `notion.dataSources.query({ data_source_id })`, não
  `notion.databases.query`.
- **pnpm** como gerenciador de pacotes.
- Auth própria e mínima por enquanto (cookie assinado + senha única, ver
  `src/lib/auth/session.ts`) — suficiente para 1-poucos usuários. Trocar por
  NextAuth/Clerk se a equipe crescer ou for preciso login por pessoa.

Ainda não decidido / decidir quando a necessidade aparecer:
- **Camada de cache/sync** (ex.: sincronizar Notion → Postgres via cron) se a API do
  Notion virar gargalo de performance ou os rate limits atrapalharem. Por ora, ler
  direto da API do Notion com `revalidate`/cache do Next é suficiente.
- Biblioteca de gráficos (candidata: Tremor ou Recharts direto).

### Estrutura de pastas

```
src/
  app/
    (dashboard)/         # rotas autenticadas — grupo sem prefixo de URL
      layout.tsx          # sidebar + shell
      page.tsx             # Visão Geral (BI)
      pipeline/            # base "Controle Geral"
      parceiros/            # lojas parceiras / scorecard
      financeiro/            # comissões, repasses
      scripts/                # Central de Scripts
      configuracoes/
    login/                # tela de login (fora do grupo autenticado)
    api/
      login/route.ts        # seta cookie de sessão
      logout/route.ts
    layout.tsx            # layout raiz (fonts, html/body)
    globals.css
  components/
    layout/               # sidebar, page header, shell
    ui/                    # primitivos de UI reutilizáveis (a criar conforme necessidade)
  config/
    nav.ts                # itens do menu lateral (módulos do Portal)
  lib/
    notion/
      client.ts            # instancia o Client do @notionhq/client + IDs de data source
      types.ts              # tipos espelhando o schema real das bases Notion
      pipeline.ts            # query + mapper da base "Controle Geral"
    auth/
      session.ts            # cookie assinado (HMAC) para o gate de acesso
    utils.ts               # helpers (ex.: cn() para classes Tailwind)
  proxy.ts               # redireciona pra /login se não houver sessão válida
```

Convenção: cada módulo do menu (`src/config/nav.ts`) mapeia para uma pasta em
`app/(dashboard)/` e, na maioria dos casos, para uma base específica do Notion listada
em `src/lib/notion/client.ts` (`dataSourceIds`). Ao adicionar um módulo novo, siga esse
padrão em vez de criar uma estrutura diferente.

### Modelo de dados — base "Controle Geral" (pipeline)

Fonte de verdade real do schema (consultada via Notion em 2026-09-03), espelhada em
`src/lib/notion/types.ts`. Principais propriedades:

- `Nome do Lead` (title), `Estado` (BA/SE/AL), `Tipo` (Cliente/Arquiteto/Engenheiro)
- `Status de Movimentação` (status): Não contatado → Contatado → Respondeu → Em conversa
  → Oportunidade identificada → Orçamento encaminhado → Parceria em andamento → Parceiro
  ativo | Sem retorno | Perdido
- `Temperatura` (Quente/Morno/Frio), `Situação do lead`, `Origem`, `Canal`
- `Base de origem` (select com o nome de cada loja parceira — usar para a página
  **Parceiros**)
- `Valor potencial`, `Valor da venda (R$)`, `Comissão (%)`
- `Data do contato`, `Data do próximo contato`, `Última interação`
- Fórmulas somente-leitura: `Score F5`, `Dias sem interação`, `SLA Follow-up F5`

Outras bases relevantes (IDs ainda não configurados em `.env.local`, ver
`.env.example`): **Comissões por Empresa** (financeiro), **Central de Scripts**
(copywriting), **Insights F5 / Inovação**.

⚠️ Ao mudar um nome de propriedade no Notion, atualize `src/lib/notion/pipeline.ts` (os
mappers referenciam as strings exatas dos nomes de coluna) — o Agente de Padronização
(#20) é quem rege essas convenções do lado do Notion.

### Convenções de código

- UI em **português (PT-BR)** — é uma ferramenta interna para brasileiros, não traduzir.
- Nomes de variáveis/funções em inglês (padrão do código), textos visíveis ao usuário em
  português.
- Server Components por padrão; só usar `"use client"` quando houver interatividade real.
- Toda chamada ao Notion (`notion.dataSources.query`, etc.) acontece no servidor (Route
  Handler ou Server Component) — nunca no client, para não vazar `NOTION_API_KEY`.
- `cn()` (`src/lib/utils.ts`) para compor classes Tailwind condicionais.

### Segurança e dados sensíveis

- Nunca commitar `.env.local` ou qualquer token/senha (`.env*` já está no `.gitignore`).
- O conteúdo estratégico da F5 (método, números reais, scripts) é confidencial — este
  repositório deve permanecer **privado**.
- `AUTH_SECRET`/`AUTH_PASSWORD` são segredos de aplicação, não de negócio — mesmo assim,
  nunca hardcoded no código.

### Próximos passos (roadmap sugerido)

1. Criar a integração interna no Notion, compartilhar as bases e preencher `.env.local`.
2. Implementar a Visão Geral: cards de funil (contagem por `Status de Movimentação`),
   distribuição por Estado/Temperatura, usando `getPipelineLeads()`.
3. Página Pipeline: tabela/kanban filtrável, priorizando por `Score F5` e
   `SLA Follow-up F5`.
4. Página Parceiros: agrupar leads por `Base de origem`, taxa de conversão por loja.
5. Página Financeiro: puxar a base "Comissões por Empresa" (criar
   `src/lib/notion/comissoes.ts` seguindo o padrão de `pipeline.ts`).
6. Avaliar se a leitura direta da API do Notion aguenta o uso real antes de introduzir
   qualquer camada de cache/sync.
