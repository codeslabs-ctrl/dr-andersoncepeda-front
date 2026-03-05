/**
 * Copiar como environment.ts y ajustar valores.
 * Este archivo no se sube al repositorio.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3006/api/v1',
  chatMenuEnabled: false,
  chatApiUrl: 'http://localhost:4999',
  appName: 'Dashboard',
  version: '1.0.0',
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100
  },
  dateFormat: 'es-VE',
  currency: 'VES',
  timezone: 'America/Caracas'
};
