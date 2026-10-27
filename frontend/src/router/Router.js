import { ENV } from '../config/env.js';
import { safeRedirectPath } from '../utils/helpers.js';

/**
 * History API router.
 *
 * Route shape:
 *   { path, loader, layout, access }          // access: 'public' | 'private' | 'guest'
 *   { path, redirect }
 * `loader` returns the Page class (dynamic import), `layout` is a Layout class.
 * The layout instance is kept while consecutive routes share the same layout.
 */
export class Router {
  #routes;
  #notFound;
  #outlet;
  #store;
  #loginPath;
  #homePath;

  #layout = null;
  #LayoutClass = null;
  #page = null;
  #navId = 0;
  #firstRender = true;
  #currentPath = '';
  #listeners = new Set();
  #abort = new AbortController();

  constructor({ routes, notFound, outlet, store, loginPath = '/login', homePath = '/dashboard' }) {
    this.#routes = routes.map((route) => ({ ...route, ...compile(route.path) }));
    this.#notFound = notFound;
    this.#outlet = outlet;
    this.#store = store;
    this.#loginPath = loginPath;
    this.#homePath = homePath;
  }

  get currentPath() {
    return this.#currentPath;
  }

  start() {
    history.scrollRestoration = 'manual';
    const { signal } = this.#abort;
    document.addEventListener('click', (event) => this.#onLinkClick(event), { signal });
    window.addEventListener('popstate', () => this.#render(new URL(location.href), 'none'), { signal });
    return this.#render(new URL(location.href), 'none');
  }

  navigate(to, { replace = false } = {}) {
    return this.#go(to, replace ? 'replace' : 'push');
  }

  /** @returns {() => void} unsubscribe function. Called after each page is mounted. */
  onNavigate(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  destroy() {
    this.#abort.abort();
    this.#page?.destroy();
    this.#layout?.destroy();
    this.#listeners.clear();
  }

  // ---------------------------------------------------------------- internals

  #onLinkClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest?.('a[data-link]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;

    event.preventDefault();
    this.navigate(url.pathname + url.search + url.hash);
  }

  #go(to, mode) {
    const url = new URL(to, location.origin);
    if (url.origin !== location.origin) {
      location.assign(url);
      return Promise.resolve();
    }
    return this.#render(url, mode);
  }

  #match(pathname) {
    for (const route of this.#routes) {
      const match = route.regex.exec(pathname);
      if (!match) continue;
      try {
        const params = {};
        route.keys.forEach((key, i) => (params[key] = decodeURIComponent(match[i + 1])));
        return { route, params };
      } catch {
        return null; // malformed percent-encoding -> 404
      }
    }
    return null;
  }

  /** @param {'push'|'replace'|'none'} mode 'none' = URL already changed (popstate/first load) */
  async #render(url, mode) {
    const id = ++this.#navId;
    const matched = this.#match(url.pathname);
    const route = matched?.route ?? this.#notFound;
    const params = matched?.params ?? {};
    const query = Object.fromEntries(url.searchParams);
    const user = this.#store.get('user');
    const redirectMode = mode === 'none' ? 'replace' : mode;

    // Redirects and guards run before anything touches history or the DOM.
    if (route.redirect) return this.#go(route.redirect, redirectMode);

    if (route.access === 'private' && !user) {
      const target = url.pathname + url.search;
      return this.#go(`${this.#loginPath}?redirect=${encodeURIComponent(target)}`, redirectMode);
    }
    if (route.access === 'guest' && user) {
      return this.#go(safeRedirectPath(query.redirect, this.#homePath), redirectMode);
    }

    if (mode !== 'none') {
      const href = url.pathname + url.search + url.hash;
      const same = href === location.pathname + location.search + location.hash;
      history[mode === 'push' && !same ? 'pushState' : 'replaceState']({}, '', href);
    }
    this.#currentPath = url.pathname;

    let PageClass;
    try {
      PageClass = await route.loader();
    } catch (error) {
      if (id === this.#navId) this.#renderFatal(error);
      return;
    }
    if (id !== this.#navId) return; // a newer navigation took over

    this.#page?.destroy();
    this.#page = null;

    const LayoutClass = route.layout;
    if (LayoutClass !== this.#LayoutClass) {
      this.#layout?.destroy();
      this.#layout = new LayoutClass({ router: this, store: this.#store });
      this.#layout.mount(this.#outlet);
      this.#LayoutClass = LayoutClass;
    }

    const page = new PageClass({ params, query, router: this, store: this.#store });
    try {
      page.mount(this.#layout.outlet);
      this.#page = page;
    } catch (error) {
      page.destroy();
      this.#renderFatal(error);
      return;
    }

    this.#afterRender(page.title);
    this.#listeners.forEach((fn) => fn({ path: this.#currentPath, params, query }));
  }

  #afterRender(title) {
    document.title = title ? `${title} · ${ENV.APP_NAME}` : ENV.APP_NAME;

    const announcer = document.getElementById('route-announcer');
    if (announcer) announcer.textContent = title ? `Página ${title}` : '';

    window.scrollTo(0, 0);
    // Move focus to the new content (not on the very first load).
    if (!this.#firstRender) this.#layout.outlet?.focus({ preventScroll: true });
    this.#firstRender = false;
  }

  #renderFatal(error) {
    console.error(error);
    const container = this.#layout?.outlet ?? this.#outlet;

    const box = document.createElement('div');
    box.className = 'fatal';
    box.setAttribute('role', 'alert');

    const title = document.createElement('h1');
    title.textContent = 'Não foi possível carregar esta página';
    const text = document.createElement('p');
    text.textContent = 'Verifique sua conexão e tente novamente.';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn--primary';
    button.textContent = 'Recarregar';
    button.addEventListener('click', () => location.reload());

    box.append(title, text, button);
    container.replaceChildren(box);
  }
}

/** '/historico/:id' -> { regex, keys: ['id'] } */
function compile(path) {
  if (path == null) return { regex: /(?!)/, keys: [] };
  const keys = [];
  const pattern = path.replace(/\/:([A-Za-z0-9_]+)/g, (_, key) => {
    keys.push(key);
    return '/([^/]+)';
  });
  return { regex: new RegExp(`^${pattern}/?$`), keys };
}
