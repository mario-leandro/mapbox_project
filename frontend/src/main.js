import { Router } from './router/Router.js';
import { AppLayout } from './layouts/AppLayout.js';
import { AuthLayout } from './layouts/AuthLayout.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { CalculatorPage } from './pages/CalculatorPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

const routes = [
  { path: '/',         page: CalculatorPage, layout: AppLayout,  private: true },
  { path: '/login',    page: LoginPage,      layout: AuthLayout, guestOnly: true },
  { path: '/cadastro', page: RegisterPage,   layout: AuthLayout, guestOnly: true },
  { path: '*',         page: NotFoundPage,   layout: AuthLayout },
];
new Router(routes, document.getElementById('app')).start();
