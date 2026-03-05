/**
 * Copiar como environment.prod.ts y ajustar apiUrl con tu dominio.
 * Este archivo no se sube al repositorio (solo el .example).
 */
export const environment = {
  production: true,
  apiUrl: 'https://TU-DOMINIO.com/api/v1',
  chatMenuEnabled: false,
  chatApiUrl: '',
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
