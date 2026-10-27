/**
 * Accepts only same-site paths, preventing open redirects
 * such as "?redirect=https://evil.example" or "?redirect=//evil.example".
 */
export function safeRedirectPath(value, fallback = '/') {
  if (typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
  return value;
}
