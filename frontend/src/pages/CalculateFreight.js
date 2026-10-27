import { Page } from '../core/Page.js';
import { html } from '../core/dom.js';

/** Placeholder: real content in stage 5. */
export class CalculateFreight extends Page {
  get title() {
    return 'Calcular frete';
  }

  render() {
    return html`
      <section class="page">
        <header class="page__header">
          <h1 class="page__title">Calcular frete</h1>
        </header>
        <div class="placeholder">Em construção: etapa 5.</div>
      </section>
    `;
  }
}
