import { h, isEmail } from '../utils/dom.js';
import { Input, Button } from '../components/ui.js';
import { AuthService } from '../services/AuthService.js';

export class RegisterPage {
  constructor(router) { this.router = router; }
  render() {
    const f = {
      name: new Input({ label: 'Nome', name: 'name', required: true }),
      email: new Input({ label: 'E-mail', name: 'email', type: 'email', required: true }),
      pass: new Input({ label: 'Senha', name: 'password', type: 'password', required: true }),
      confirm: new Input({ label: 'Confirmar senha', name: 'confirm', type: 'password', required: true }),
    };
    const btn = new Button({ label: 'Criar conta', type: 'submit' }).render();
    const msg = h('p', { class: 'form-error', role: 'alert' });
    return h('form', { class: 'card auth-card', novalidate: true, onSubmit: async (e) => {
      e.preventDefault(); msg.className = 'form-error'; msg.textContent = '';
      const errs = {
        name: f.name.val ? '' : 'Informe seu nome',
        email: isEmail(f.email.val) ? '' : 'E-mail inválido',
        pass: f.pass.val.length >= 8 ? '' : 'Mínimo de 8 caracteres',
        confirm: f.confirm.val === f.pass.val ? '' : 'As senhas não coincidem',
      };
      Object.entries(errs).forEach(([k, v]) => f[k].setError(v));
      if (Object.values(errs).some(Boolean)) return;
      btn.setLoading(true);
      try {
        await AuthService.register(f.name.val, f.email.val, f.pass.val);
        msg.className = 'form-ok'; // backend envia e-mail de confirmação (PHPMailer)
        msg.textContent = 'Cadastro realizado. Verifique seu e-mail para confirmar a conta.';
      } catch (err) { msg.textContent = err.message; } finally { btn.setLoading(false); }
    } },
      h('h1', {}, 'Criar conta'), ...Object.values(f).map(i => i.render()), msg, btn,
      h('p', { class: 'muted' }, 'Já tem conta? ', h('a', { href: '/login', 'data-link': '' }, 'Entrar')));
  }
}
