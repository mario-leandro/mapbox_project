import { h } from '../utils/dom.js';
export class AuthLayout {
  render(content) { return h('div', { class: 'auth' }, content); }
}
