/**
 * Safe HTML helpers. Everything interpolated through `html` is escaped,
 * unless it is already marked safe (another `html` result or `raw()`).
 */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

const SAFE = Symbol('safe-html');
const markSafe = (value) => ({ [SAFE]: true, value, toString: () => value });
const isSafe = (value) => Boolean(value && value[SAFE]);

/** Marks a string as trusted. Never use it with data coming from the API or the user. */
export const raw = (value) => markSafe(String(value));

function toHTML(value) {
  if (value == null || value === false) return '';
  if (isSafe(value)) return value.value;
  if (Array.isArray(value)) return value.map(toHTML).join('');
  return escapeHTML(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((value, i) => {
    out += toHTML(value) + strings[i + 1];
  });
  return markSafe(out);
}
