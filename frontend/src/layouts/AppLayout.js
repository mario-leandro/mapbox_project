import { h } from '../utils/dom.js';
import { Sidebar, Header } from '../components/Shell.js';

export class AppLayout {
  constructor(router) { this.router = router; }
  render(content) {
    return h('div', { class: 'app' }, new Sidebar().render(),
      h('div', { class: 'main' }, new Header(this.router).render(), h('main', { class: 'content' }, content)));
  }
}
