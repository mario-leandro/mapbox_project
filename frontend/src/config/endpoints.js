/**
 * API contract in ONE place. These are provisional paths:
 * adjust here when the real PHP contract is defined.
 */
export const ENDPOINTS = Object.freeze({
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
  },
  config: {
    map: '/config/map',
  },
  addresses: {
    byCep: (cep) => `/addresses/cep/${encodeURIComponent(cep)}`,
  },
  freights: {
    calculate: '/freights/calculate',
    list: '/freights',
    detail: (id) => `/freights/${encodeURIComponent(id)}`,
    summary: '/freights/summary',
    pricing: '/freights/pricing',
  },
});
