import { html } from '../core/dom.js';
import { icon } from '../assets/icons/icons.js';
import { ENV } from '../config/env.js';

/** Stateless template: the logo link. `inverse` is for dark backgrounds. */
export function brand(href, { inverse = false } = {}) {
  return html`<a class="brand ${inverse ? 'brand--inverse' : ''}" href="${href}" data-link>
    <span class="brand__mark">${icon('route', 18)}</span>
    <span class="brand__name">${ENV.APP_NAME}</span>
  </a>`;
}
