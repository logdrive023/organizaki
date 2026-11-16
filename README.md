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
