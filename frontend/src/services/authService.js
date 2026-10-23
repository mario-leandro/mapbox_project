import { config } from '../config/config.js';
import { HttpClient } from './HttpClient.js';
import { session } from './session.js';

export class AuthService {
  static async login(email, password) {
    const d = await HttpClient.post(config.endpoints.login, { email, password }, { auth: false });
    session.accessToken = d.accessToken; session.user = d.user;
  }
  static register(name, email, password) {
    return HttpClient.post(config.endpoints.register, { name, email, password }, { auth: false });
  }
  static async restore() {
    if (session.accessToken) return true;
    try { await HttpClient.refresh(); return true; } catch { return false; }
  }
  static async logout() {
    try { await HttpClient.post(config.endpoints.logout, {}, { retry: false }); } catch { /* ignora */ }
    session.accessToken = null; session.user = null;
  }
}
