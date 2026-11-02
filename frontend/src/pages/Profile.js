import { createComponent } from '../core/Component.js';
import { html } from '../core/dom.js';

/** Placeholder: real content in stage 8. */
export function Profile() {
  return createComponent(() => ({
    title: 'Perfil',

    render() {
      return html`
        <section class="page">
          <header class="page__header">
            <h1 class="page__title">Perfil</h1>
          </header>
          <div class="placeholder">Em construção: etapa 8.</div>
        </section>
      `;
    },
  }));
}
