export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || '/api';
export const API_POLL_INTERVAL = Number(import.meta.env.VITE_APP_API_POLL_INTERVAL) || 5000;
export const API_SYNC_TIMEOUT = Number(import.meta.env.VITE_APP_API_SYNC_TIMEOUT) || 5000;
export const LOGGER_ENABLED = import.meta.env.VITE_APP_LOGGER_ENABLED?.toLowerCase() === 'true';
export const IS_DEMO = Boolean(import.meta.env.VITE_APP_DEMO);