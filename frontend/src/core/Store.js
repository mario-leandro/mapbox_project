/** Tiny observable store. Keep it minimal: session and theme only. */
export class Store {
  #state;
  #subscribers = new Map();

  constructor(initial = {}) {
    this.#state = { ...initial };
  }

  get(key) {
    return this.#state[key];
  }

  set(patch) {
    for (const [key, value] of Object.entries(patch)) {
      if (Object.is(this.#state[key], value)) continue;
      this.#state[key] = value;
      this.#subscribers.get(key)?.forEach((fn) => fn(value));
    }
  }

  /** @returns {() => void} unsubscribe function */
  subscribe(key, fn) {
    if (!this.#subscribers.has(key)) this.#subscribers.set(key, new Set());
    this.#subscribers.get(key).add(fn);
    return () => this.#subscribers.get(key)?.delete(fn);
  }
}

export const store = new Store({
  user: null, // { name, email } while logged in
  accessToken: null, // memory only, never persisted
  theme: 'light',
});
