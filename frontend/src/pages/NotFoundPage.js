import { h } from '../utils/dom.js';
export class NotFoundPage {
  render() { return h('div', { class: 'card auth-card' }, h('h1', {}, 'Página não encontrada'), h('a', { href: '/', 'data-link': '' }, 'Voltar ao início')); }
}
