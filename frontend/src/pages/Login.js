import { createComponent } from '../core/Component.js';
import { html } from '../core/dom.js';
import { safeRedirectPath } from '../utils/helpers.js';

/**
 * TEMPORARY (stage 2): lets you test private routes and guards without a backend.
 * Stage 3 replaces this with the real form + AuthService.
 */
export function Login({ store, router, query }) {
  return createComponent((ctx) => ({
    title: 'Entrar',

    render() {
      return html`
        <section class="auth-card">
          <h1 class="page__title">Entrar</h1>
          <p class="text-muted">O formulário real chega na etapa 3. Por enquanto, simule uma sessão para testar as rotas.</p>
          <button type="button" class="btn btn--primary btn--block" data-action="fake-login">Simular login</button>
          <p class="auth-card__footer">Não tem conta? <a href="/cadastro" data-link>Criar conta</a></p>
        </section>
      `;
    },

    onMount() {
      ctx.delegate('click', '[data-action="fake-login"]', () => {
        store.set({ user: { name: 'Usuário demo', email: 'demo@example.com' } });
        router.navigate(safeRedirectPath(query.redirect, '/dashboard'));
      });
    },
  }));
}
