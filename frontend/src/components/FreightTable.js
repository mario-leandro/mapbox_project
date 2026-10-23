import { h, fmtKm, fmtMeters, fmtDuration, fmtMoney } from '../utils/dom.js';

export class FreightTable {
  render(result, origin, destination) {
    const cols = ['Origem', 'Destino', 'Distância (km)', 'Distância (m)', 'Tempo estimado', 'Valor por km', 'Taxa fixa', 'Total estimado'];
    const vals = [origin, destination, fmtKm(result.distanceMeters), fmtMeters(result.distanceMeters), fmtDuration(result.durationSeconds),
      fmtMoney(result.pricePerKm), fmtMoney(result.fixedFee), fmtMoney(result.total)];
    return h('div', {},
      result.mock && h('p', { class: 'banner' }, 'Dados simulados (MockFreightService). Defina config.useMock = false para usar o backend.'),
      h('div', { class: 'table-wrap' }, h('table', {},
        h('thead', {}, h('tr', {}, cols.map(c => h('th', {}, c)))),
        h('tbody', {}, h('tr', {}, vals.map((v, i) => h('td', { class: i === 7 ? 'total' : '' }, v)))))));
  }
}
