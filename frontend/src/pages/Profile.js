import { Page } from '../core/Page.js';
import { html } from '../core/dom.js';

/** Placeholder: real content in stage 8. */
export class Profile extends Page {
  get title() {
    return 'Perfil';
  }

  render() {
    return html`
      <section class="page">
        <header class="page__header">
          <h1 class="page__title">Perfil</h1>
        </header>
        <div class="placeholder">Em construção: etapa 8.</div>
      </section>
    `;
  }
}
