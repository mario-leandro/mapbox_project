import { Page } from '../core/Page.js';
import { html } from '../core/dom.js';

/** Placeholder: real content in stage 4. */
export class Dashboard extends Page {
  get title() {
    return 'Dashboard';
  }

  render() {
    return html`
      <section class="page">
        <header class="page__header">
          <h1 class="page__title">Dashboard</h1>
        </header>
        <div class="placeholder">Em construção: etapa 4.</div>
      </section>
    `;
  }
}
