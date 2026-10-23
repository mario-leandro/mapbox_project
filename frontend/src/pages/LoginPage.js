import { h, isEmail } from '../utils/dom.js';
import { Input, Button } from '../components/ui.js';
import { AuthService } from '../services/AuthService.js';

export class LoginPage {
  constructor(router) { this.router = router; }
  render() {
    const email = new Input({ label: 'E-mail', name: 'email', type: 'email', required: true });
    const pass = new Input({ label: 'Senha', name: 'password', type: 'password', required: true });
    const btn = new Button({ label: 'Entrar', type: 'submit' }).render();
    const msg = h('p', { class: 'form-error', role: 'alert' });
    return h('form', { class: 'card auth-card', novalidate: true, onSubmit: async (e) => {
      e.preventDefault(); msg.textContent = '';
      email.setError(isEmail(email.val) ? '' : 'Informe um e-mail válido');
      pass.setError(pass.val ? '' : 'Informe a senha');
      if (!isEmail(email.val) || !pass.val) return;
      btn.setLoading(true);
      try { await AuthService.login(email.val, pass.val); this.router.navigate('/'); }
      catch (err) { msg.textContent = err.message; } finally { btn.setLoading(false); }
    } },
      h('h1', {}, 'Entrar'), h('p', { class: 'muted' }, 'Acesse sua conta para calcular fretes.'),
      email.render(), pass.render(), msg, btn,
      h('p', { class: 'muted' }, 'Não tem conta? ', h('a', { href: '/cadastro', 'data-link': '' }, 'Cadastre-se')));
  }
}
