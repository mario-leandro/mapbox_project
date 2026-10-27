/**
 * Safe HTML helpers. Everything interpolated through `html` is escaped,
 * unless it is already a SafeHTML (another `html` result or `raw()`).
 */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

export class SafeHTML {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/** Marks a string as trusted. Never use it with data coming from the API or the user. */
export const raw = (value) => new SafeHTML(String(value));

function toHTML(value) {
  if (value == null || value === false) return '';
  if (value instanceof SafeHTML) return value.value;
  if (Array.isArray(value)) return value.map(toHTML).join('');
  return escapeHTML(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((value, i) => {
    out += toHTML(value) + strings[i + 1];
  });
  return new SafeHTML(out);
}
