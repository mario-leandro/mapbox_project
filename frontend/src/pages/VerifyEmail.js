import { Page } from '../core/Page.js';
import { html } from '../core/dom.js';

/** Placeholder: reads ?token= and calls the backend in stage 3. */
export class VerifyEmail extends Page {
  get title() {
    return 'Confirmar e-mail';
  }

  render() {
    return html`
      <section class="auth-card">
        <h1 class="page__title">Confirmar e-mail</h1>
        <p class="text-muted">Em construção: etapa 3.</p>
        <p class="auth-card__footer"><a href="/login" data-link>Voltar ao login</a></p>
      </section>
    `;
  }
}
