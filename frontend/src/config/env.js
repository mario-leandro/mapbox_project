/**
 * Runtime configuration. Nothing secret lives here:
 * the Mapbox token and every Mapbox call stay in the PHP backend.
 */
export const ENV = Object.freeze({
  APP_NAME: 'Freightly',
  API_BASE_URL: 'http://localhost:8000/api',
  REQUEST_TIMEOUT_MS: 15000,

  // When true, services read from src/mocks/ and the UI shows a demo banner.
  USE_MOCKS: true,

  FEATURES: Object.freeze({
    // Stops UI is built but disabled until the backend supports it.
    STOPS_ENABLED: false,
  }),
});
