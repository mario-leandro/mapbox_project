# Rotafácil (frontend)
Rode com um servidor estático com fallback para `index.html` (History API), por exemplo: `npx serve -s .`. O comando usa a porta 3000 por padrão.

Configure `src/config/config.js` (`apiBaseUrl`, token público Mapbox e `useMock`). O backend deve estar acessível em `http://localhost:8000` ou atualize `apiBaseUrl`.

O backend permite, por padrão, as origens locais `http://localhost:3000` e `http://localhost:5500`. Para configurar outras origens, defina `CORS_ALLOWED_ORIGINS` no `backend/.env` com uma lista separada por vírgulas, sem caminhos (por exemplo: `http://localhost:3000,http://localhost:5173`). As credenciais são habilitadas apenas para origens permitidas; não use `*` junto com cookies.
