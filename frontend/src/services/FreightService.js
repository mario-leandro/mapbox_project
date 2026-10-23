import { config } from '../config/config.js';
import { HttpClient } from './HttpClient.js';
import { MockFreightService } from './MockFreightService.js';

export class FreightService {
  /** addresses: [origem, ...paradas, destino] na ordem da rota. */
  static estimate(addresses) {
    if (config.useMock) return MockFreightService.estimate(addresses);
    return HttpClient.post(config.endpoints.estimate, { points: addresses });
  }
}
