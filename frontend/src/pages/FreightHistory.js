import { Page } from '../core/Page.js';
import { html } from '../core/dom.js';

/** Placeholder: real content in stage 7. */
export class FreightHistory extends Page {
  get title() {
    return 'Histórico';
  }

  render() {
    return html`
      <section class="page">
        <header class="page__header">
          <h1 class="page__title">Histórico</h1>
        </header>
        <div class="placeholder">Em construção: etapa 7.</div>
      </section>
    `;
  }
}
