// DADOS SIMULADOS — não representam regras comerciais. Usado só com config.useMock = true.
export class MockFreightService {
  static async estimate(addresses) {
    await new Promise(r => setTimeout(r, 700));
    const base = [-38.5434, -3.7319];
    const points = addresses.map((a, i) => ({ lng: base[0] + i * 0.02, lat: base[1] + i * 0.015, label: a.street }));
    return {
      mock: true, distanceMeters: null, durationSeconds: null,
      geometry: { type: 'LineString', coordinates: points.map(p => [p.lng, p.lat]) },
      points, pricePerKm: null, fixedFee: null, total: null,
    };
  }
}
