import { Component } from '../core/Component.js';
import { html } from '../core/dom.js';
import { store } from '../core/Store.js';
import { toggleTheme } from '../core/theme.js';
import { icon } from '../assets/icons/icons.js';

/** Light/dark switch. Keeps itself in sync with the store. */
export class ThemeToggle extends Component {
  render() {
    const dark = store.get('theme') === 'dark';
    return html`<button type="button" class="icon-btn" aria-label="${dark ? 'Ativar tema claro' : 'Ativar tema escuro'}">
      ${icon(dark ? 'sun' : 'moon')}
    </button>`;
  }

  onMount() {
    const button = this.$('button');
    this.on(button, 'click', toggleTheme);
    this.addCleanup(
      store.subscribe('theme', (theme) => {
        const dark = theme === 'dark';
        button.innerHTML = String(icon(dark ? 'sun' : 'moon'));
        button.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
      }),
    );
  }
}
