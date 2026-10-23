import { h, icon, refreshIcons } from '../utils/dom.js';

export class Button {
  constructor({ label, iconName, variant = 'primary', type = 'button', onClick }) { Object.assign(this, { label, iconName, variant, type, onClick }); }
  render() {
    const b = h('button', { class: `btn btn-${this.variant}`, type: this.type, onClick: this.onClick }, this.iconName && icon(this.iconName), h('span', {}, this.label));
    b.setLoading = (on) => { b.disabled = on; b.classList.toggle('is-loading', on); };
    return b;
  }
}

export class Input {
  constructor({ label, name, type = 'text', value = '', required = false, placeholder = '', onInput }) { Object.assign(this, { label, name, type, value, required, placeholder, onInput }); }
  render() {
    this.input = h('input', { name: this.name, type: this.type, value: this.value, placeholder: this.placeholder, onInput: (e) => this.onInput?.(e) });
    this.err = h('small', { class: 'error', role: 'alert' });
    this.el = h('label', { class: 'field' }, h('span', {}, this.label + (this.required ? ' *' : '')), this.input, this.err);
    return this.el;
  }
  get val() { return this.input.value.trim(); }
  set val(v) { this.input.value = v ?? ''; }
  setError(msg = '') { this.err.textContent = msg; this.el.classList.toggle('invalid', !!msg); }
}

export class Card {
  constructor({ title, subtitle, actions }) { Object.assign(this, { title, subtitle, actions }); }
  render(...body) {
    return h('section', { class: 'card' },
      this.title && h('header', { class: 'card-head' }, h('h2', {}, this.title), this.subtitle && h('p', { class: 'muted' }, this.subtitle), this.actions),
      h('div', { class: 'card-body' }, body));
  }
}

export class Loading {
  static render(text = 'Carregando...') { return h('div', { class: 'loading' }, h('span', { class: 'spinner' }), text); }
}

export class Modal {
  static open(title, content) {
    const close = () => overlay.remove();
    const overlay = h('div', { class: 'modal-overlay', onClick: (e) => e.target === overlay && close() },
      h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' },
        h('header', {}, h('h3', {}, title), h('button', { class: 'btn btn-ghost', 'aria-label': 'Fechar', onClick: close }, icon('x'))), content));
    document.body.append(overlay); refreshIcons();
    return close;
  }
}
