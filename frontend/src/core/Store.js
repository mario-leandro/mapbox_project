/** Tiny observable store. Keep it minimal: session and theme only. */
export function createStore(initial = {}) {
  const state = { ...initial };
  const subscribers = new Map();

  return {
    get: (key) => state[key],

    set(patch) {
      for (const [key, value] of Object.entries(patch)) {
        if (Object.is(state[key], value)) continue;
        state[key] = value;
        subscribers.get(key)?.forEach((fn) => fn(value));
      }
    },

    /** @returns {() => void} unsubscribe function */
    subscribe(key, fn) {
      if (!subscribers.has(key)) subscribers.set(key, new Set());
      subscribers.get(key).add(fn);
      return () => subscribers.get(key)?.delete(fn);
    },
  };
}

export const store = createStore({
  user: null, // { name, email } while logged in
  accessToken: null, // memory only, never persisted
  theme: 'light',
});
