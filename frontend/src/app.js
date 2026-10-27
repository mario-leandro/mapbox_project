import { store } from './core/Store.js';
import { initTheme } from './core/theme.js';
import { Router } from './router/Router.js';
import { AuthLayout } from './layouts/AuthLayout.js';
import { MainLayout } from './layouts/MainLayout.js';

/**
 * Route table. Pages are loaded on demand with dynamic import().
 * access: 'public' (anyone) | 'private' (needs session) | 'guest' (only when logged out)
 */
const routes = [
  { path: '/', redirect: '/dashboard' },

  { path: '/login', loader: () => import('./pages/Login.js').then((m) => m.Login), layout: AuthLayout, access: 'guest' },
  { path: '/cadastro', loader: () => import('./pages/Register.js').then((m) => m.Register), layout: AuthLayout, access: 'guest' },
  { path: '/verificar-email', loader: () => import('./pages/VerifyEmail.js').then((m) => m.VerifyEmail), layout: AuthLayout, access: 'public' },

  { path: '/dashboard', loader: () => import('./pages/Dashboard.js').then((m) => m.Dashboard), layout: MainLayout, access: 'private' },
  { path: '/calcular-frete', loader: () => import('./pages/CalculateFreight.js').then((m) => m.CalculateFreight), layout: MainLayout, access: 'private' },
  { path: '/historico', loader: () => import('./pages/FreightHistory.js').then((m) => m.FreightHistory), layout: MainLayout, access: 'private' },
  { path: '/historico/:id', loader: () => import('./pages/FreightHistory.js').then((m) => m.FreightHistory), layout: MainLayout, access: 'private' },
  { path: '/perfil', loader: () => import('./pages/Profile.js').then((m) => m.Profile), layout: MainLayout, access: 'private' },
];

const notFound = {
  loader: () => import('./pages/NotFound.js').then((m) => m.NotFound),
  // The 404 screen adapts to the session: app chrome if logged in, auth chrome otherwise.
  get layout() {
    return store.get('user') ? MainLayout : AuthLayout;
  },
};

/** Stage 3: call the refresh endpoint here so a page reload keeps the session. */
async function restoreSession() {}

async function bootstrap() {
  initTheme();
  await restoreSession();

  const router = new Router({
    routes,
    notFound,
    outlet: document.getElementById('app'),
    store,
  });
  await router.start();
}

bootstrap();
