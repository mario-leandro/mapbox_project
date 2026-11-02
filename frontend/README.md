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

Sem classes: componentes, roteador e store são **funções fábrica**; o estado privado
vive em variáveis dentro da função (closures).

```
Pages / Components  ->  Services  ->  ApiService  ->  fetch  ->  API PHP
```

- `core/Component.js`: `createComponent(setup)` e `createLayout(setup)`.
  Ciclo de vida `render()` / `onMount()` / `onDestroy()`.
  Listeners só via `ctx.on()` ou `ctx.delegate()`; o `destroy()` remove todos.
- `core/dom.js`: tag `html` que escapa toda interpolação (proteção contra XSS).
- `core/Store.js`: `createStore()`; a instância `store` guarda só sessão e tema.
- `router/Router.js`: `createRouter()`, History API, guards (`public`, `private`, `guest`),
  parâmetros (`/historico/:id`), 404, import dinâmico de páginas.
- `layouts/`: `AuthLayout` e `MainLayout`; o layout é preservado entre páginas que o compartilham.

### Anatomia de um componente

```js
import { createComponent } from '../core/Component.js';
import { html } from '../core/dom.js';

export function Counter({ start = 0 }) {
  return createComponent((ctx) => {
    let count = start; // estado privado

    return {
      render() {
        return html`<button type="button">${count}</button>`;
      },
      onMount() {
        ctx.on(ctx.$('button'), 'click', () => {
          count += 1;
          ctx.$('button').textContent = count;
        });
      },
      reset() { count = start; }, // qualquer outra chave vira método público
    };
  });
}
```

Uso: `const c = Counter({ start: 5 }); c.mount(elemento); ... c.destroy();`

### Criar uma nova página

1. Crie `src/pages/MinhaPagina.js` exportando `function MinhaPagina(props)` que retorna
   `createComponent(...)` com uma chave `title`. As props do roteador são
   `{ params, query, router, store }`.
2. Adicione uma linha em `routes` no `src/app.js`.
3. (Opcional) adicione o link em `NAV_ITEMS`, em `components/Sidebar.js`.
