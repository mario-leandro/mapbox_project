import { createComponent } from '../core/Component.js';
import { html } from '../core/dom.js';
import { icon } from '../assets/icons/icons.js';

export function NotFound({ store }) {
  return createComponent(() => ({
    title: 'Página não encontrada',

    render() {
      const loggedIn = Boolean(store.get('user'));
      return html`
        <section class="not-found">
          <span class="not-found__icon">${icon('pin', 28)}</span>
          <h1 class="page__title">Página não encontrada</h1>
          <p class="text-muted">O endereço que você acessou não existe ou foi movido.</p>
          <a class="btn btn--primary" href="${loggedIn ? '/dashboard' : '/login'}" data-link>
            ${loggedIn ? 'Ir para o dashboard' : 'Ir para o login'}
          </a>
        </section>
      `;
    },
  }));
}
