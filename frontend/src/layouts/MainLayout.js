import { createLayout } from '../core/Component.js';
import { html } from '../core/dom.js';
import { icon } from '../assets/icons/icons.js';
import { ENV } from '../config/env.js';
import { Sidebar } from '../components/Sidebar.js';
import { Navbar } from '../components/Navbar.js';

/** Private area chrome: sidebar + navbar + content outlet. */
export function MainLayout({ router, store }) {
  return createLayout((ctx) => {
    let menuOpen = false;
    let sidebar;
    let navbar;

    function setMenu(open) {
      menuOpen = open;
      ctx.$('.shell').classList.toggle('shell--menu-open', open);
      navbar.setMenuExpanded(open);
      if (open) sidebar.focusFirstLink();
    }

    // TEMPORARY (stage 2): stage 3 replaces this with authService.logout().
    function logout() {
      store.set({ user: null, accessToken: null });
      router.navigate('/login');
    }

    return {
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
      },

      onMount() {
        sidebar = ctx.addChild(Sidebar(), ctx.$('[data-slot="sidebar"]'));
        navbar = ctx.addChild(
          Navbar({ store, onMenuToggle: () => setMenu(!menuOpen), onLogout: logout }),
          ctx.$('[data-slot="navbar"]'),
        );

        sidebar.setActive(router.currentPath);
        ctx.addCleanup(
          router.onNavigate(({ path }) => {
            sidebar.setActive(path);
            setMenu(false);
          }),
        );

        ctx.on(ctx.$('.shell__backdrop'), 'click', () => setMenu(false));
        ctx.on(document, 'keydown', (event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenu(false);
            navbar.focusMenuButton();
          }
        });
      },
    };
  });
}
