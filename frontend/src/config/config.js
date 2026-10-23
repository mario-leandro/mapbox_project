// CONTRATOS A CONFIRMAR COM O BACKEND PHP (URLs e formato de resposta).
export const config = {
  apiBaseUrl: 'http://localhost:8000',
  mapboxPublicToken: 'pk.COLOQUE_SEU_TOKEN_PUBLICO', // somente token público (pk.)
  useMock: true, // true = FreightService usa dados simulados (MockFreightService)
  viaCepUrl: 'https://viacep.com.br/ws',
  endpoints: {
    login:    '/api/auth/login',     // POST {email,password} -> {accessToken,user:{name,email}} + cookie refresh HttpOnly
    register: '/api/auth/register',  // POST {name,email,password} -> {message}
    refresh:  '/api/auth/refresh',   // POST (cookie) -> {accessToken,user}
    logout:   '/api/auth/logout',    // POST
    estimate: '/api/freight/estimate' // POST {points:[{cep,street,number,complement,district,city,state}]}
    // -> {distanceMeters,durationSeconds,geometry:GeoJSON LineString,
    //     points:[{lat,lng,label}],pricePerKm,fixedFee,total}
  },
};
