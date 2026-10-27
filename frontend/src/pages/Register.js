import { Page } from '../core/Page.js';
import { html } from '../core/dom.js';

/** Placeholder: real form in stage 3. */
export class Register extends Page {
  get title() {
    return 'Criar conta';
  }

  render() {
    return html`
      <section class="auth-card">
        <h1 class="page__title">Criar conta</h1>
        <p class="text-muted">Em construção: etapa 3.</p>
        <p class="auth-card__footer">Já tem conta? <a href="/login" data-link>Entrar</a></p>
      </section>
    `;
  }
}
