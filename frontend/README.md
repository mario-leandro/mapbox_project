# Freightly: frontend

SPA em HTML, CSS e JavaScript puro (ES Modules), sem framework e sem build.
Consome a API REST em PHP e exibe rotas com Mapbox GL JS.

> Estado atual: **Etapa 2** (estrutura, roteador, layouts, tema). Login, dashboard,
> cálculo, mapa e histórico são placeholders e entram nas próximas etapas.

## Executar

O app usa rotas reais (`/dashboard`, `/historico/12`), então o servidor precisa devolver
`index.html` para caminhos desconhecidos.

```bash
python3 dev-server.py          # http://localhost:5500
python3 dev-server.py 8080     # outra porta
# alternativa: npx serve -s . -l 5500
```

Abra `http://localhost:5500`. Como ainda não há login real, use o botão **Simular login**.

## Configuração

`src/config/env.js`: URL da API, timeout e a flag `USE_MOCKS`.
`src/config/endpoints.js`: todos os caminhos da API em um só lugar.

Front e API em domínios diferentes exigem no PHP:
`Access-Control-Allow-Origin` com a origem exata (nunca `*`),
`Access-Control-Allow-Credentials: true` e resposta ao preflight `OPTIONS`.

## Arquitetura

```
Pages / Components  ->  Services  ->  ApiService  ->  fetch  ->  API PHP
```

- `core/Component.js`: ciclo de vida `render()` / `onMount()` / `destroy()`.
  Listeners só via `this.on()` ou `this.delegate()`; o `destroy()` remove todos.
- `core/dom.js`: tag `html` que escapa toda interpolação (proteção contra XSS).
- `router/Router.js`: History API, guards (`public`, `private`, `guest`),
  parâmetros (`/historico/:id`), 404, import dinâmico de páginas.
- `layouts/`: `AuthLayout` e `MainLayout`; o layout é preservado entre páginas que o compartilham.

### Criar uma nova página

1. Crie `src/pages/MinhaPagina.js` com `class MinhaPagina extends Page`.
2. Adicione uma linha em `routes` no `src/app.js`.
3. (Opcional) adicione o link em `NAV_ITEMS`, em `components/Sidebar.js`.
