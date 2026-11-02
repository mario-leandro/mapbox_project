import { createComponent } from '../core/Component.js';
import { html } from '../core/dom.js';
import { icon } from '../assets/icons/icons.js';
import { ThemeToggle } from './ThemeToggle.js';

/** @param {{ store, onMenuToggle: () => void, onLogout: () => void }} props */
export function Navbar({ store, onMenuToggle, onLogout }) {
  return createComponent((ctx) => ({
    render() {
      const name = store.get('user')?.name ?? '';
      return html`
        <header class="navbar">
          <button type="button" class="icon-btn navbar__menu" data-action="menu"
            aria-label="Abrir menu" aria-controls="sidebar" aria-expanded="false">${icon('menu')}</button>
          <div class="navbar__spacer"></div>
          <div data-slot="theme"></div>
          <div class="navbar__user">
            <span class="avatar" aria-hidden="true">${name.charAt(0).toUpperCase() || '?'}</span>
            <span class="navbar__name">${name}</span>
          </div>
          <button type="button" class="icon-btn" data-action="logout" aria-label="Sair">${icon('logout')}</button>
        </header>
      `;
    },

    onMount() {
      ctx.addChild(ThemeToggle(), ctx.$('[data-slot="theme"]'));
      ctx.delegate('click', '[data-action="menu"]', () => onMenuToggle());
      ctx.delegate('click', '[data-action="logout"]', () => onLogout());
    },

    setMenuExpanded(expanded) {
      const button = ctx.$('[data-action="menu"]');
      button.setAttribute('aria-expanded', String(expanded));
      button.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
    },

    focusMenuButton() {
      ctx.$('[data-action="menu"]')?.focus();
    },
  }));
}
