import { Page } from '../core/Page.js';
import { html } from '../core/dom.js';
import { safeRedirectPath } from '../utils/helpers.js';

/**
 * TEMPORARY (stage 2): lets you test private routes and guards without a backend.
 * Stage 3 replaces this with the real form + AuthService.
 */
export class Login extends Page {
  get title() {
    return 'Entrar';
  }

  render() {
    return html`
      <section class="auth-card">
        <h1 class="page__title">Entrar</h1>
        <p class="text-muted">O formulário real chega na etapa 3. Por enquanto, simule uma sessão para testar as rotas.</p>
        <button type="button" class="btn btn--primary btn--block" data-action="fake-login">Simular login</button>
        <p class="auth-card__footer">Não tem conta? <a href="/cadastro" data-link>Criar conta</a></p>
      </section>
    `;
  }

  onMount() {
    this.delegate('click', '[data-action="fake-login"]', () => {
      this.store.set({ user: { name: 'Usuário demo', email: 'demo@example.com' } });
      this.router.navigate(safeRedirectPath(this.query.redirect, '/dashboard'));
    });
  }
}
