/**
 * Component factory (no classes).
 *
 * A component is a function that returns createComponent(setup).
 * `setup` receives a context (`ctx`) and returns the component definition:
 *
 *   export function Counter({ start }) {
 *     return createComponent((ctx) => {
 *       let count = start;                         // private state = closure variable
 *       return {
 *         render() { return html`<button>${count}</button>`; },
 *         onMount() { ctx.on(ctx.$('button'), 'click', () => { ... }); },
 *         reset() { count = start; },              // any other key becomes a public method
 *       };
 *     });
 *   }
 *
 * Lifecycle: render() -> mount(el) -> onMount() ... destroy() -> onDestroy().
 * Register listeners only through ctx.on() / ctx.delegate(): they share one
 * AbortController, so destroy() removes all of them at once.
 * A destroyed component cannot be mounted again; call the factory again.
 */
export function createComponent(setup) {
  const abort = new AbortController();
  const children = new Set();
  const cleanups = [];
  let el = null;

  const ctx = {
    get el() {
      return el;
    },
    $: (selector) => el?.querySelector(selector) ?? null,
    $$: (selector) => (el ? [...el.querySelectorAll(selector)] : []),

    /** addEventListener tied to this component's lifetime. */
    on(target, type, handler, options = {}) {
      target.addEventListener(type, handler, { ...options, signal: abort.signal });
    },

    /** Event delegation inside this component. Use 'focusin' instead of 'focus'. */
    delegate(type, selector, handler) {
      ctx.on(el, type, (event) => {
        const target = event.target.closest?.(selector);
        if (target && el.contains(target)) handler(event, target);
      });
    },

    /** Register a function to run on destroy (e.g. a store unsubscribe). */
    addCleanup(fn) {
      cleanups.push(fn);
    },

    /** Mounts a child into `container` and destroys it together with this component. */
    addChild(child, container) {
      child.mount(container);
      children.add(child);
      return child;
    },
  };

  const { render = () => '', onMount, onDestroy, ...methods } = setup(ctx);

  const instance = {
    ...methods,
    get el() {
      return el;
    },
    mount(container) {
      el = container;
      container.innerHTML = String(render());
      onMount?.();
      return instance;
    },
    destroy() {
      if (!el) return;
      onDestroy?.();
      children.forEach((child) => child.destroy());
      children.clear();
      cleanups.splice(0).forEach((fn) => fn());
      abort.abort();
      el.innerHTML = '';
      el = null;
    },
  };
  return instance;
}

/**
 * Same as createComponent, plus getOutlet(): the element where the Router mounts pages.
 * A layout's markup must contain an element with id="main-content".
 */
export function createLayout(setup) {
  const layout = createComponent(setup);
  layout.getOutlet = () => layout.el?.querySelector('#main-content') ?? null;
  return layout;
}
