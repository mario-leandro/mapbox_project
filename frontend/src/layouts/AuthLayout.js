import { Layout } from '../core/Layout.js';
import { html } from '../core/dom.js';
import { brand } from '../components/Brand.js';
import { ThemeToggle } from '../components/ThemeToggle.js';

/** Public screens (login, register...): brand panel + centered content. */
export class AuthLayout extends Layout {
  render() {
    return html`
      <div class="auth">
        <section class="auth__brand">
          ${brand('/login', { inverse: true })}
          <div class="auth__pitch">
            <p class="auth__headline">Frete calculado sobre a rota real.</p>
            <p class="auth__sub">Informe coleta e entrega e veja distância, tempo e valor no mapa.</p>
          </div>
          <svg class="auth__art" viewBox="0 0 480 320" aria-hidden="true" focusable="false">
            <path class="auth__streets" d="M0 60H480M0 140H480M0 220H480M0 300H480M80 0V320M180 0V320M300 0V320M400 0V320" />
            <path class="auth__route" pathLength="1" d="M70 250C150 250 140 150 230 150S330 90 410 70" />
            <circle cx="70" cy="250" r="10" fill="var(--color-success)" stroke="#fff" stroke-width="3" />
            <circle cx="410" cy="70" r="10" fill="var(--color-danger)" stroke="#fff" stroke-width="3" />
          </svg>
        </section>
        <div class="auth__panel">
          <div class="auth__tools" data-slot="theme"></div>
          <main id="main-content" class="auth__content" tabindex="-1"></main>
        </div>
      </div>
    `;
  }

  onMount() {
    this.addChild(new ThemeToggle(), this.$('[data-slot="theme"]'));
  }
}
