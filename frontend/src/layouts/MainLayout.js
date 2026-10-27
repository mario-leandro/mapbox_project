import { Layout } from '../core/Layout.js';
import { html } from '../core/dom.js';
import { icon } from '../assets/icons/icons.js';
import { ENV } from '../config/env.js';
import { Sidebar } from '../components/Sidebar.js';
import { Navbar } from '../components/Navbar.js';

/** Private area chrome: sidebar + navbar + content outlet. Props: { router, store } */
export class MainLayout extends Layout {
  #menuOpen = false;

  render() {
    return html`
      <div class="shell">
        <div data-slot="sidebar"></div>
        <div class="shell__backdrop"></div>
        <div class="shell__main">
          ${ENV.USE_MOCKS &&
          html`<div class="banner banner--warning" role="status">
            ${icon('alert', 18)}<span>Dados de demonstração: as informações exibidas não são reais.</span>
          </div>`}
          <div data-slot="navbar"></div>
          <main id="main-content" class="shell__content" tabindex="-1"></main>
        </div>
      </div>
    `;
  }

  onMount() {
    const { router, store } = this.props;

    this.sidebar = this.addChild(new Sidebar(), this.$('[data-slot="sidebar"]'));
    this.navbar = this.addChild(
      new Navbar({
        store,
        onMenuToggle: () => this.#setMenu(!this.#menuOpen),
        onLogout: () => this.#logout(),
      }),
      this.$('[data-slot="navbar"]'),
    );

    this.sidebar.setActive(router.currentPath);
    this.addCleanup(
      router.onNavigate(({ path }) => {
        this.sidebar.setActive(path);
        this.#setMenu(false);
      }),
    );

    this.on(this.$('.shell__backdrop'), 'click', () => this.#setMenu(false));
    this.on(document, 'keydown', (event) => {
      if (event.key === 'Escape' && this.#menuOpen) {
        this.#setMenu(false);
        this.navbar.focusMenuButton();
      }
    });
  }

  #setMenu(open) {
    this.#menuOpen = open;
    this.$('.shell').classList.toggle('shell--menu-open', open);
    this.navbar.setMenuExpanded(open);
    if (open) this.sidebar.focusFirstLink();
  }

  // TEMPORARY (stage 2): stage 3 replaces this with authService.logout().
  #logout() {
    const { router, store } = this.props;
    store.set({ user: null, accessToken: null });
    router.navigate('/login');
  }
}
