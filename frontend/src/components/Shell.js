import { h, icon } from '../utils/dom.js';
import { session } from '../services/session.js';
import { AuthService } from '../services/AuthService.js';

export class Sidebar {
  render() {
    const link = (href, ic, text) => h('a', { href, 'data-link': '', class: location.pathname === href ? 'active' : '' }, icon(ic), text);
    return h('aside', { class: 'sidebar', id: 'sidebar' },
      h('div', { class: 'brand' }, icon('route'), 'Rotafácil'),
      h('nav', {}, link('/', 'calculator', 'Calculadora de frete')));
  }
}

export class Header {
  constructor(router) { this.router = router; }
  render() {
    return h('header', { class: 'topbar' },
      h('button', { class: 'btn btn-ghost menu-toggle', 'aria-label': 'Menu', onClick: () => document.getElementById('sidebar').classList.toggle('open') }, icon('menu')),
      h('div', { class: 'user' }, icon('circle-user'), h('span', {}, session.user?.name ?? session.user?.email ?? 'Usuário')),
      h('button', { class: 'btn btn-ghost', onClick: async () => { await AuthService.logout(); this.router.navigate('/login'); } }, icon('log-out'), 'Sair'));
  }
}
