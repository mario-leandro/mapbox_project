// Access token SOMENTE em memória. O refresh token fica em cookie HttpOnly (backend).
export const session = { accessToken: null, user: null };
