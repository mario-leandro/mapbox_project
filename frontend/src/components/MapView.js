import { config } from '../config/config.js';
import { h } from '../utils/dom.js';

export class MapView {
  constructor() { this.markers = []; }
  render() { this.el = h('div', { class: 'map' }); return this.el; }
  init() {
    mapboxgl.accessToken = config.mapboxPublicToken;
    this.map = new mapboxgl.Map({ container: this.el, style: 'mapbox://styles/mapbox/streets-v12', center: [-38.52, -3.73], zoom: 10 });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.ready = new Promise(r => this.map.on('load', r));
  }
  async draw({ geometry, points }) {
    await this.ready;
    this.markers.forEach(m => m.remove()); this.markers = [];
    if (this.map.getSource('route')) { this.map.removeLayer('route'); this.map.removeSource('route'); }
    this.map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry } });
    this.map.addLayer({ id: 'route', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#0f766e', 'line-width': 5 } });
    points.forEach((p, i) => {
      const last = i === points.length - 1;
      const pin = h('div', { class: `pin ${i === 0 ? 'origin' : last ? 'dest' : 'stop'}` }, i === 0 ? 'A' : last ? 'B' : String(i));
      this.markers.push(new mapboxgl.Marker(pin).setLngLat([p.lng, p.lat]).addTo(this.map));
    });
    const c = geometry.coordinates;
    this.map.fitBounds(c.reduce((b, x) => b.extend(x), new mapboxgl.LngLatBounds(c[0], c[0])), { padding: 60, duration: 600 });
  }
}
