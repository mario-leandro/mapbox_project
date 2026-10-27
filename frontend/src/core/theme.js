import { store } from './Store.js';

const STORAGE_KEY = 'theme';

/** The inline script in index.html already set data-theme before first paint. */
export function initTheme() {
  const current = document.documentElement.dataset.theme;
  store.set({ theme: current === 'dark' ? 'dark' : 'light' });
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the theme still applies.
  }
  store.set({ theme });
}

export function toggleTheme() {
  setTheme(store.get('theme') === 'dark' ? 'light' : 'dark');
}
