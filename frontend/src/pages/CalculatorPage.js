import { h, fmtKm, fmtDuration, refreshIcons } from '../utils/dom.js';
import { Card, Button, Loading } from '../components/ui.js';
import { AddressForm } from '../components/AddressForm.js';
import { FreightTable } from '../components/FreightTable.js';
import { MapView } from '../components/MapView.js';
import { FreightService } from '../services/FreightService.js';

export class CalculatorPage {
  constructor(router) {
    this.router = router; this.stops = [];
    this.origin = new AddressForm({ title: 'Coleta · Ponto A' });
    this.dest = new AddressForm({ title: 'Entrega · Ponto B' });
    this.map = new MapView();
  }
  get route() { return [this.origin, ...this.stops, this.dest]; } // ordem da rota

  addStop() {
    const stop = new AddressForm({ title: '', onRemove: (s) => { this.stops = this.stops.filter(x => x !== s); s.el.remove(); this.renumber(); } });
    this.stops.push(stop); this.stopsEl.append(stop.render()); this.renumber(); refreshIcons();
  }
  renumber() { this.stops.forEach((s, i) => s.setTitle(`Parada ${i + 1}`)); }

  async calculate() {
    this.error.textContent = '';
    if (!this.route.map(f => f.validate()).every(Boolean)) { this.error.textContent = 'Preencha os campos obrigatórios destacados.'; return; }
    this.btn.setLoading(true); this.results.replaceChildren(Loading.render('Calculando rota...'));
    try {
      const r = await FreightService.estimate(this.route.map(f => f.getValue()));
      this.results.replaceChildren(new Card({ title: 'Estimativa de frete' }).render(
        h('p', { class: 'summary' }, `${fmtKm(r.distanceMeters)} · ${fmtDuration(r.durationSeconds)} · ${this.stops.length} parada(s)`),
        new FreightTable().render(r, this.origin.toString(), this.dest.toString())));
      await this.map.draw(r);
    } catch (err) { this.results.replaceChildren(); this.error.textContent = err.message; }
    finally { this.btn.setLoading(false); }
  }

  render() {
    this.stopsEl = h('div', { class: 'stops' });
    this.error = h('p', { class: 'form-error', role: 'alert' });
    this.btn = new Button({ label: 'Calcular frete', iconName: 'calculator', onClick: () => this.calculate() }).render();
    this.results = h('div', {});
    const addBtn = new Button({ label: 'Adicionar parada', iconName: 'plus', variant: 'secondary', onClick: () => this.addStop() }).render();
    return h('div', { class: 'stack' },
      h('h1', {}, 'Calculadora de frete'),
      new Card({ title: 'Endereços', subtitle: 'Informe o CEP para preencher automaticamente.' }).render(
        this.origin.render(), this.stopsEl, h('div', { class: 'row' }, addBtn), this.dest.render(), this.error, h('div', { class: 'row' }, this.btn)),
      this.results,
      new Card({ title: 'Rota no mapa' }).render(this.map.render()));
  }
  mounted() { this.map.init(); }
}
