# organizaki

Web do Organizaki: landing, página pública do evento (convite, confirmação de presença, lista de presentes) e painel
do anfitrião. React 19 + Vite + TypeScript + Tailwind 4 + React Query. A API fica em `logdrive023/organizaki-backend`.

## Subir local
```bash
npm install
npm run dev        # http://localhost:5180 — /api e /uploads vão para a API em :8095 (VITE_API_PROXY muda o alvo)
npm run build      # checa tipos e gera dist/
```
Suba a API antes (ver README do backend). Conta de teste e evento demo (`/e/demo`) vêm do `seed` do backend.

## Demonstração no GitHub Pages
`https://logdrive023.github.io/organizaki/` — publicada pelo workflow `.github/workflows/deploy.yml` a cada push na `main`.
No Pages não há API: o build `npm run build:pages` liga o modo demonstração (`.env.pages`, `VITE_DEMO=true`) e as
chamadas vão para `src/lib/demo.ts`, que segue o mesmo contrato e as mesmas regras da API Go com os dados no
localStorage do navegador. Na tela de entrada há "Entrar na demonstração" e "Recomeçar a demonstração do zero".
```bash
npm run dev:demo      # o mesmo modo, local, sem precisar da API
```
Configuração única no GitHub: Settings → Pages → Source: **GitHub Actions**.

## Rotas
| Rota | O quê |
|---|---|
| `/` | landing |
| `/entrar` · `/criar-conta` | login e cadastro |
| `/e/:slug` (`?convite=<token>`) | página pública do evento |
| `/painel` | eventos · `/eventos/novo` · `/eventos/:id` (Resumo, Convidados, Presentes, Detalhes) · `/eventos/:id/editar` |
| `/painel/convidados` · `/presentes` · `/presentes/:eventId/:giftId` · `/estatisticas` · `/notificacoes` · `/configuracoes` | painel |
| `/ajuda` · `/termos` · `/privacidade` · `/cookies` | ajuda e legal |

## Estrutura
```
src/lib         api (token com renovação), sessão, tipos do contrato, formatação pt-BR, tickets de presente
src/components  ui (botões, campos, modal <dialog>, abas), layout do site, gerenciadores de convidados/presentes
src/pages       landing, auth, publico/, painel/, legal/, ajuda
```
