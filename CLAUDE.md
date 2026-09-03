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
      page.tsx             # Visão Geral (BI) — aceita ?estado=SE|BA
      pipeline/            # Controle Geral (CRM) — aceita ?estado=SE|BA
      prospeccao/           # Prospecções (só existe por estado — sem "Geral" próprio)
      relacionamento/        # Profissionais (arquitetos/engenheiros/construtoras)
      scripts/                 # Central de Scripts — taxa de resposta
      financeiro/               # Lançamentos + Comissões por Empresa
      parceiros/                 # lojas parceiras / scorecard (via Base de origem)
      configuracoes/
    login/                # tela de login (fora do grupo autenticado)
    api/
      login/route.ts        # seta cookie de sessão
      logout/route.ts
    layout.tsx            # layout raiz (fonts, html/body)
    globals.css
  components/
    layout/               # sidebar, page header, shell, state-tabs (seletor Geral/SE/BA)
    ui/                    # primitivos de UI reutilizáveis (a criar conforme necessidade)
  config/
    nav.ts                # itens do menu lateral (módulos do Portal)
  lib/
    notion/
      client.ts            # Client do @notionhq/client + IDs de data source (Geral/SE/BA)
      types.ts              # tipos espelhando o schema real de cada base Notion
      mappers.ts             # helpers genéricos (plainText, selectValue, formulaValue...)
      pipeline.ts             # Controle Geral (CRM)
      scripts.ts               # Central de Scripts
      prospeccoes.ts            # Prospecções
      profissionais.ts           # Profissionais (relacionamento)
      comissoes.ts                # Comissões por Empresa
      financeiro.ts                 # Lançamentos Financeiros
      analytics.ts                   # funil, conversão, ranking — cálculos puros e testáveis
    auth/
      session.ts            # cookie assinado (HMAC) para o gate de acesso
    utils.ts               # helpers (ex.: cn() para classes Tailwind)
  proxy.ts                 # redireciona pra /login se não houver sessão válida
```

Convenção: cada módulo do menu (`src/config/nav.ts`) mapeia para uma pasta em
`app/(dashboard)/` e para uma base do Notion em `src/lib/notion/<base>.ts`. Módulos que
existem em mais de um estado recebem `?estado=Geral|SE|BA` e escolhem a data source
certa via `dataSourceIds` (`client.ts`) — nunca duplicar a página por estado. Ao
adicionar um módulo novo, siga esse padrão.

### Mapa do ecossistema Notion (o que existe de verdade)

O ecossistema F5 no Notion tem **3 ramos favoritados** (confirmado por Fellipe em
2026-09-03) — é isso que o Portal precisa espelhar em dashboards, um por base:

```
Dashboard Geral  (consolidado — "painel-mãe", fed por Sincronização Geral)
├─ Controle Geral (CRM)        767 leads · pipeline master
├─ Financeiro
│  ├─ Comissões por Empresa     % / contrato por loja parceira (10 lojas)
│  └─ Lançamentos Financeiros   receita/despesa, Estado = SE|BA|AL|Geral
├─ Insights F5 / Inovação       gargalos/oportunidades por agente de origem
└─ Agenda, Viagens, Anotações, Feedbacks, Arquivos, Tarefas, Marketing, Agentes
   (hub operacional/pessoal — sem dashboard por ora, ver "Fora de escopo" abaixo)

Sergipe - SE                    Bahia - BA
├─ Controle Geral - SE (pipeline, mesmo schema do consolidado — herda por Sincronização)
├─ Lojas                        (uma sub-base por loja parceira do estado)
├─ Financeiro → Lançamentos (+ Comissões, quando existir por estado)
├─ Profissionais                rede de arquitetos/engenheiros/construtoras
├─ Prospecções                  leads de campo (obras/condomínios)
├─ Condomínios
├─ Central de Scripts / Scripts scripts de WhatsApp com taxa de resposta
├─ Movimentação (Rodízio de Disparo)   lotes de disparo por empresa/segmento/ciclo
├─ Pós-Venda — SE/BA
└─ Anotações, Feedbacks, Arquivos (operacional, sem dashboard por ora)
```

SE e BA têm a mesma estrutura (o método é replicado 1:1 entre estados); **AL ainda não
tem página própria no Notion** — hoje só aparece como opção do campo `Estado` nas bases
consolidadas.

**Regra de design do Portal**: cada módulo do menu (Pipeline, Prospecção,
Relacionamento, Scripts, Financeiro) é **parametrizado por estado**
(`Geral` | `SE` | `BA`) — mesmo componente/página, troca só a data source consultada.
Não duplicar código por estado; ver `src/lib/notion/client.ts` (`dataSourceIds`) e
`src/components/layout/state-tabs.tsx`.

#### Schema real por base (consultado via Notion em 2026-09-03)

**Controle Geral (pipeline/CRM)** — espelhado em `src/lib/notion/types.ts`
(`LeadPipeline`):
- `Nome do Lead` (title), `Estado` (BA/SE/AL), `Tipo` (Cliente/Arquiteto/Engenheiro)
- `Status de Movimentação` (status): Não contatado → Contatado → Respondeu → Em conversa
  → Oportunidade identificada → Orçamento encaminhado → Parceria em andamento → Parceiro
  ativo | Sem retorno | Perdido
- `Temperatura` (Quente/Morno/Frio), `Situação do lead`, `Origem`, `Canal`
- `Base de origem` (select com o nome de cada loja parceira — usar na página **Parceiros**)
- `Valor potencial`, `Valor da venda (R$)`, `Comissão (%)`
- `Data do contato`, `Data do próximo contato`, `Última interação`
- Fórmulas somente-leitura: `Score F5`, `Dias sem interação`, `SLA Follow-up F5`

**Central de Scripts / Scripts** (`ScriptWhatsapp`): `Nome do Script` (title), `Empresa`,
`Segmento`, `Etapa do Funil` (Abordagem inicial/Follow-up/Reativação/Fechamento),
`Status` (Em teste/Ativo/Descontinuado), `Leads enviados (qtd)`,
`Respostas recebidas (qtd)`, `Taxa de resposta (%)`, `Versão`, `Data de criação`,
`Data do último disparo`, `Observações / Aprendizados`. → base direta para "estudar cada
passo": comparar taxa de resposta por Empresa × Segmento × Etapa.

**Prospecções** (`Prospeccao`): `Proprietário` (title), `Estado`, `Etapa da obra`
(Fundação/Estrutura/Alvenaria/Pilares/Acabamento), `Padrão` (Alto/Médio), `Condomínio`,
`Endereço/Lote`, `Arquiteto`/`Engenheiro`/`Mestre de obras` + contatos,
`Empresas que já contataram` (multi-select — mede o rodízio), `Loja da vez`,
`Último disparo`, `Histórico de disparos`, `Data da prospecção`.

**Profissionais** (`Profissional`): `Nome` (title), `Tipo`
(Arquiteto/Engenheiro/Construtora), `Relacionamento` (Não iniciado → Em contato →
Ativo — a escada do Agente 2), `Empresa / Escritório`, `Contato`, `Estado`,
`Observações`.

**Movimentação / Rodízio de Disparo** (`LoteDisparo`): `Nome do Disparo` (title),
`Empresa`, `Segmento`, `Quantidade de Leads`, `Status` (Não iniciada/Em
andamento/Concluído), `Ciclo` (número), `Data de Disparo`,
`Data de Descanso (liberação)`, `Leads do Lote` (relation).

**Comissões por Empresa** (`ComissaoEmpresa`): `Empresa` (title),
`Status do contrato` (Ativo/Pendente negociação/Não fechado), `Tipo de comissão`
(Percentual/Fixo mensal/A negociar), `Percentual (%)`, `Valor fixo mensal (R$)`,
`Observações`.

**Lançamentos Financeiros** (`LancamentoFinanceiro`): `Descrição` (title), `Tipo`
(Receita/Despesa), `Categoria` (Vendas/Impostos/Folha/Marketing/Operacional/Outros),
`Centro de custo` (Loja/Obras/Administrativo), `Estado` (SE/BA/AL/Geral), `Valor`,
`Conta`, `Status` (Pendente/Pago-Recebido), `Competência`, `Data de vencimento`,
`Data de pagamento/recebimento`, `Cliente/Fornecedor`.

**Insights F5 / Inovação** (`Insight`): `Insight` (title), `Tipo` (Gargalo/Oportunidade/
Padrão observado/Ideia de inovação), `Agente de Origem` (um dos 22 agentes), `Status`
(Novo/Em análise/Validado/Aplicado/Descartado), `Descrição`, `Dado de Suporte`, `Data`.

#### IDs conhecidos das data sources

Ver `src/lib/notion/client.ts` — os IDs das bases consolidadas e de SE/BA já estão
hardcoded como constantes (não são segredo, só o `NOTION_API_KEY` é). Duas bases da
Bahia ainda não tiveram o schema confirmado (prováveis Profissionais/Rodízio BA — a
estrutura espelha Sergipe mas a ordem das páginas não bateu 1:1 na exploração); marcadas
como `TODO` no código. Ao confirmar, preencher o ID e remover o TODO.

#### Fora de escopo (por ora)

Agenda, Viagens, Anotações, Feedbacks, Arquivos, Tarefas, Marketing, Lojas
(sub-bases por loja), Condomínios, Pós-Venda, Formulário de Prospecção: existem no
Notion mas não têm dashboard no Portal ainda — são operacionais/pessoais ou muito
granulares para uma visão de performance. Adicionar sob demanda, seguindo o mesmo
padrão (`src/lib/notion/<base>.ts` + página em `app/(dashboard)/`).

⚠️ Ao mudar um nome de propriedade no Notion, atualize o mapper correspondente em
`src/lib/notion/` (os mappers referenciam as strings exatas dos nomes de coluna) — o
Agente de Padronização (#20) é quem rege essas convenções do lado do Notion.

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

### Filosofia: o Portal é um espelho + uma lupa

O Portal **não guarda dado próprio de negócio** — ele lê ao vivo (Server Components,
sem cache longo) as mesmas bases que os 22 agentes já mantêm atualizadas no Notion.
Preencher/mudar algo no Notion aparece aqui na próxima carga da página, sem passo de
sincronização manual. Isso é deliberado: o Notion continua sendo o sistema de registro;
o Portal é onde a F5 **estuda o próprio método** — funil, conversão por etapa, taxa de
resposta por script, SLA, comparação entre SE e BA — coisa que o Notion não faz bem em
view nativa. Toda página nova deve nascer como leitura + análise, não como um formulário
duplicado de cadastro.

### Próximos passos (roadmap sugerido)

1. Criar a integração interna no Notion, compartilhar as bases (Geral + SE + BA) e
   preencher `.env.local` com `NOTION_API_KEY`.
2. Confirmar os 2 IDs de data source da Bahia marcados como `TODO` em
   `src/lib/notion/client.ts` (prováveis Profissionais/Rodízio BA).
3. Validar em produção que a leitura direta da API do Notion aguenta o uso real (rate
   limit, latência) antes de introduzir qualquer camada de cache/sync — o modelo atual
   assume que não vai precisar.
4. Extrair para `analytics.ts` qualquer cálculo de funil/conversão que apareça duplicado
   entre páginas — é o lugar certo pros "estudos de performance" pedidos pelo Fellipe.
5. Trocar as barras/tabelas em CSS puro por uma lib de gráfico (Tremor ou Recharts)
   quando o volume de métricas justificar.
