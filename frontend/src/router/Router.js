import { ENV } from '../config/env.js';
import { safeRedirectPath } from '../utils/helpers.js';

/**
 * History API router (factory, state lives in the closure).
 *
 * Route shape:
 *   { path, loader, layout, access }          // access: 'public' | 'private' | 'guest'
 *   { path, redirect }
 * `loader` returns the page factory (dynamic import), `layout` is a layout factory.
 * The layout instance is kept while consecutive routes share the same layout.
 */
export function createRouter({ routes: routeDefs, notFound, outlet, store, loginPath = '/login', homePath = '/dashboard' }) {
  const routes = routeDefs.map((route) => ({ ...route, ...compile(route.path) }));
  const listeners = new Set();
  const abort = new AbortController();

  let layout = null;
  let currentLayoutFactory = null;
  let page = null;
  let navId = 0;
  let firstRender = true;
  let currentPath = '';

  function onLinkClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest?.('a[data-link]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;

    event.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  }

  function go(to, mode) {
    const url = new URL(to, location.origin);
    if (url.origin !== location.origin) {
      location.assign(url);
      return Promise.resolve();
    }
    return render(url, mode);
  }

  function match(pathname) {
    for (const route of routes) {
      const found = route.regex.exec(pathname);
      if (!found) continue;
      try {
        const params = {};
        route.keys.forEach((key, i) => (params[key] = decodeURIComponent(found[i + 1])));
        return { route, params };
      } catch {
        return null; // malformed percent-encoding -> 404
      }
    }
    return null;
  }

  /** @param {'push'|'replace'|'none'} mode 'none' = URL already changed (popstate/first load) */
  async function render(url, mode) {
    const id = ++navId;
    const matched = match(url.pathname);
    const route = matched?.route ?? notFound;
    const params = matched?.params ?? {};
    const query = Object.fromEntries(url.searchParams);
    const user = store.get('user');
    const redirectMode = mode === 'none' ? 'replace' : mode;

    // Redirects and guards run before anything touches history or the DOM.
    if (route.redirect) return go(route.redirect, redirectMode);

    if (route.access === 'private' && !user) {
      const target = url.pathname + url.search;
      return go(`${loginPath}?redirect=${encodeURIComponent(target)}`, redirectMode);
    }
    if (route.access === 'guest' && user) {
      return go(safeRedirectPath(query.redirect, homePath), redirectMode);
    }

    if (mode !== 'none') {
      const href = url.pathname + url.search + url.hash;
      const same = href === location.pathname + location.search + location.hash;
      history[mode === 'push' && !same ? 'pushState' : 'replaceState']({}, '', href);
    }
    currentPath = url.pathname;

    let PageFactory;
    try {
      PageFactory = await route.loader();
    } catch (error) {
      if (id === navId) renderFatal(error);
      return;
    }
    if (id !== navId) return; // a newer navigation took over

    page?.destroy();
    page = null;

    const LayoutFactory = route.layout;
    if (LayoutFactory !== currentLayoutFactory) {
      layout?.destroy();
      layout = LayoutFactory({ router, store });
      layout.mount(outlet);
      currentLayoutFactory = LayoutFactory;
    }

    const nextPage = PageFactory({ params, query, router, store });
    try {
      nextPage.mount(layout.getOutlet());
      page = nextPage;
    } catch (error) {
      nextPage.destroy();
      renderFatal(error);
      return;
    }

    afterRender(nextPage.title);
    listeners.forEach((fn) => fn({ path: currentPath, params, query }));
  }

  function afterRender(title) {
    document.title = title ? `${title} · ${ENV.APP_NAME}` : ENV.APP_NAME;

    const announcer = document.getElementById('route-announcer');
    if (announcer) announcer.textContent = title ? `Página ${title}` : '';

    window.scrollTo(0, 0);
    // Move focus to the new content (not on the very first load).
    if (!firstRender) layout.getOutlet()?.focus({ preventScroll: true });
    firstRender = false;
  }

  function renderFatal(error) {
    console.error(error);
    const container = layout?.getOutlet() ?? outlet;

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

  function navigate(to, { replace = false } = {}) {
    return go(to, replace ? 'replace' : 'push');
  }

  const router = {
    get currentPath() {
      return currentPath;
    },

    start() {
      history.scrollRestoration = 'manual';
      document.addEventListener('click', onLinkClick, { signal: abort.signal });
      window.addEventListener('popstate', () => render(new URL(location.href), 'none'), { signal: abort.signal });
      return render(new URL(location.href), 'none');
    },

    navigate,

    /** @returns {() => void} unsubscribe function. Called after each page is mounted. */
    onNavigate(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    destroy() {
      abort.abort();
      page?.destroy();
      layout?.destroy();
      listeners.clear();
    },
  };

  return router;
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
