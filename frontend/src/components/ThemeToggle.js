import { createComponent } from '../core/Component.js';
import { html } from '../core/dom.js';
import { store } from '../core/Store.js';
import { toggleTheme } from '../core/theme.js';
import { icon } from '../assets/icons/icons.js';

const labelFor = (theme) => (theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');

/** Light/dark switch. Keeps itself in sync with the store. */
export function ThemeToggle() {
  return createComponent((ctx) => ({
    render() {
      const theme = store.get('theme');
      return html`<button type="button" class="icon-btn" aria-label="${labelFor(theme)}">
        ${icon(theme === 'dark' ? 'sun' : 'moon')}
      </button>`;
    },

    onMount() {
      const button = ctx.$('button');
      ctx.on(button, 'click', toggleTheme);
      ctx.addCleanup(
        store.subscribe('theme', (theme) => {
          button.innerHTML = String(icon(theme === 'dark' ? 'sun' : 'moon'));
          button.setAttribute('aria-label', labelFor(theme));
        }),
      );
    },
  }));
}
