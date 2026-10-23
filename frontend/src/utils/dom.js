export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'class') el.className = v;
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
  }
  el.append(...children.flat(Infinity).filter(c => c != null && c !== false));
  return el;
}
export const icon = (name) => h('i', { 'data-lucide': name });
export const refreshIcons = () => window.lucide?.createIcons();

export const fmtKm = (m) => m == null ? '—' : `${(m / 1000).toFixed(2).replace('.', ',')} km`;
export const fmtMeters = (m) => m == null ? '—' : `${Math.round(m).toLocaleString('pt-BR')} m`;
export const fmtMoney = (v) => v == null ? '—' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const fmtDuration = (s) => {
  if (s == null) return '—';
  const min = Math.round(s / 60);
  return min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`;
};
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const maskCep = (v) => v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
