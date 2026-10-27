import { Component } from '../core/Component.js';
import { html } from '../core/dom.js';
import { icon } from '../assets/icons/icons.js';
import { ThemeToggle } from './ThemeToggle.js';

/**
 * Props: { store, onMenuToggle(), onLogout() }
 */
export class Navbar extends Component {
  render() {
    const user = this.props.store.get('user');
    const name = user?.name ?? '';
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
  }

  onMount() {
    this.addChild(new ThemeToggle(), this.$('[data-slot="theme"]'));
    this.delegate('click', '[data-action="menu"]', () => this.props.onMenuToggle());
    this.delegate('click', '[data-action="logout"]', () => this.props.onLogout());
  }

  setMenuExpanded(expanded) {
    const button = this.$('[data-action="menu"]');
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
  }

  focusMenuButton() {
    this.$('[data-action="menu"]')?.focus();
  }
}
