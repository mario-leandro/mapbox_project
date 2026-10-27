import { Component } from '../core/Component.js';
import { html } from '../core/dom.js';
import { icon } from '../assets/icons/icons.js';
import { brand } from './Brand.js';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/calcular-frete', label: 'Calcular frete', icon: 'route' },
  { href: '/historico', label: 'Histórico', icon: 'history' },
  { href: '/perfil', label: 'Perfil', icon: 'user' },
];

export class Sidebar extends Component {
  render() {
    return html`
      <aside id="sidebar" class="sidebar">
        <div class="sidebar__head">${brand('/dashboard')}</div>
        <nav aria-label="Navegação principal">
          <ul class="sidebar__list">
            ${NAV_ITEMS.map(
              (item) => html`<li>
                <a class="sidebar__link" href="${item.href}" data-link>${icon(item.icon)}<span>${item.label}</span></a>
              </li>`,
            )}
          </ul>
        </nav>
      </aside>
    `;
  }

  /** Marks the link matching the current path (also for nested paths like /historico/12). */
  setActive(path) {
    this.$$('.sidebar__link').forEach((link) => {
      const href = link.getAttribute('href');
      const active = path === href || path.startsWith(`${href}/`);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  focusFirstLink() {
    this.$('.sidebar__link')?.focus();
  }
}
