import { AuthService } from '../services/AuthService.js';
import { refreshIcons } from '../utils/dom.js';

export class Router {
  constructor(routes, outlet) {
    this.routes = routes; this.outlet = outlet;
    window.addEventListener('popstate', () => this.resolve());
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-link]');
      if (a) { e.preventDefault(); this.navigate(a.getAttribute('href')); }
    });
  }
  navigate(path) { history.pushState({}, '', path); return this.resolve(); }
  start() { return this.resolve(); }

  async resolve() {
    const route = this.routes.find(r => r.path === location.pathname) ?? this.routes.find(r => r.path === '*');
    if (route.private && !(await AuthService.restore())) return this.navigate('/login');
    if (route.guestOnly && await AuthService.restore()) return this.navigate('/');
    const page = new route.page(this);
    const content = await page.render();
    const Layout = route.layout;
    this.outlet.replaceChildren(Layout ? new Layout(this).render(content) : content);
    page.mounted?.();
    refreshIcons();
  }
}
