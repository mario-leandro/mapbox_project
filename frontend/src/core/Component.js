/**
 * Base class for every component, page and layout.
 *
 * Lifecycle:
 *   render()  -> returns the markup (use the `html` tag so data is escaped)
 *   mount(el) -> injects the markup into `el`, then calls onMount()
 *   destroy() -> runs cleanups, destroys children, removes ALL listeners
 *
 * Register listeners only through `this.on()` / `this.delegate()`:
 * they share one AbortController, so destroy() removes them all at once.
 * A destroyed component cannot be mounted again; create a new instance.
 */
export class Component {
  #abort = new AbortController();
  #children = new Set();
  #cleanups = [];

  el = null;

  constructor(props = {}) {
    this.props = props;
  }

  /** @returns {string|import('./dom.js').SafeHTML} */
  render() {
    return '';
  }

  /** Hook: query elements, register listeners, mount children. */
  onMount() {}

  /** Hook: release resources that are not listeners (maps, timers...). */
  onDestroy() {}

  mount(container) {
    this.el = container;
    container.innerHTML = String(this.render());
    this.onMount();
    return this;
  }

  /** addEventListener tied to this component's lifetime. */
  on(target, type, handler, options = {}) {
    target.addEventListener(type, handler, { ...options, signal: this.#abort.signal });
  }

  /** Event delegation inside this component. Use 'focusin' instead of 'focus'. */
  delegate(type, selector, handler) {
    this.on(this.el, type, (event) => {
      const target = event.target.closest?.(selector);
      if (target && this.el.contains(target)) handler(event, target);
    });
  }

  /** Register a function to run on destroy (e.g. a store unsubscribe). */
  addCleanup(fn) {
    this.#cleanups.push(fn);
  }

  /** Mounts a child component into `container` and destroys it with this one. */
  addChild(child, container) {
    child.mount(container);
    this.#children.add(child);
    return child;
  }

  $(selector) {
    return this.el?.querySelector(selector) ?? null;
  }

  $$(selector) {
    return this.el ? [...this.el.querySelectorAll(selector)] : [];
  }

  destroy() {
    if (!this.el) return;
    this.onDestroy();
    this.#children.forEach((child) => child.destroy());
    this.#children.clear();
    this.#cleanups.forEach((fn) => fn());
    this.#cleanups = [];
    this.#abort.abort();
    this.el.innerHTML = '';
    this.el = null;
  }
}
