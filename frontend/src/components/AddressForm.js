import { h, icon, maskCep } from '../utils/dom.js';
import { Input } from './ui.js';
import { AddressService } from '../services/AddressService.js';

const FIELDS = [
  ['cep', 'CEP', true], ['street', 'Rua', true], ['number', 'Número', true], ['complement', 'Complemento', false],
  ['district', 'Bairro', false], ['city', 'Cidade', true], ['state', 'Estado (UF)', true],
];

export class AddressForm {
  constructor({ title, onRemove }) {
    this.title = title; this.onRemove = onRemove;
    this.inputs = Object.fromEntries(FIELDS.map(([name, label, required]) => [name, new Input({ label, name, required })]));
  }
  render() {
    const { cep } = this.inputs;
    cep.onInput = async (e) => {
      e.target.value = maskCep(e.target.value);
      if (e.target.value.length !== 9) return;
      cep.setError('Buscando CEP...');
      try {
        const d = await AddressService.lookupCep(e.target.value);
        for (const [k, v] of Object.entries(d)) if (v) this.inputs[k].val = v; // continuam editáveis
        cep.setError(); this.inputs.number.input.focus();
      } catch (err) { cep.setError(err.message); }
    };
    this.legend = h('legend', {}, this.title);
    if (this.onRemove) this.legend.append(h('button', { type: 'button', class: 'btn btn-ghost', 'aria-label': 'Remover parada', onClick: () => this.onRemove(this) }, icon('trash-2')));
    this.el = h('fieldset', { class: 'address' }, this.legend, h('div', { class: 'grid' }, Object.values(this.inputs).map(i => i.render())));
    return this.el;
  }
  setTitle(t) { this.title = t; this.legend.firstChild.textContent = t; }
  getValue() { return Object.fromEntries(Object.entries(this.inputs).map(([k, i]) => [k, i.val])); }
  validate() {
    let ok = true;
    FIELDS.forEach(([name, , required]) => {
      const bad = required && !this.inputs[name].val;
      this.inputs[name].setError(bad ? 'Campo obrigatório' : '');
      if (bad) ok = false;
    });
    return ok;
  }
  toString() { const v = this.getValue(); return `${v.street}, ${v.number}${v.complement ? ' ' + v.complement : ''} – ${v.district ? v.district + ', ' : ''}${v.city}/${v.state}`; }
}
