import { config } from '../config/config.js';

export class AddressService {
  static async lookupCep(cep) {
    const digits = cep.replace(/\D/g, '');
    const res = await fetch(`${config.viaCepUrl}/${digits}/json/`);
    const d = await res.json();
    if (!res.ok || d.erro) throw new Error('CEP não encontrado.');
    return { street: d.logradouro, district: d.bairro, city: d.localidade, state: d.uf, complement: d.complemento };
  }
}
