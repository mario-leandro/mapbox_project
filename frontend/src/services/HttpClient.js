import { config } from '../config/config.js';
import { session } from './session.js';

export class HttpClient {
  static refreshing = null;

  static async request(path, { method = 'GET', body, auth = true, retry = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth && session.accessToken) headers.Authorization = `Bearer ${session.accessToken}`;

    const res = await fetch(config.apiBaseUrl + path, {
      method, headers, credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401 && auth && retry) {
      try { await HttpClient.refresh(); } catch { session.accessToken = null; throw new Error('Sessão expirada. Entre novamente.'); }
      return HttpClient.request(path, { method, body, auth, retry: false });
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || `Erro ${res.status}`);
    return data;
  }

  static refresh() {
    HttpClient.refreshing ??= HttpClient.request(config.endpoints.refresh, { method: 'POST', auth: false, retry: false })
      .then(d => { session.accessToken = d.accessToken; session.user = d.user ?? session.user; })
      .finally(() => { HttpClient.refreshing = null; });
    return HttpClient.refreshing;
  }
  static get(p, o) { return HttpClient.request(p, o); }
  static post(p, body, o) { return HttpClient.request(p, { ...o, method: 'POST', body }); }
}
