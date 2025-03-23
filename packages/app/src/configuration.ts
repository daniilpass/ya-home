export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
export const API_POLL_INTERVAL = Number(process.env.REACT_APP_API_POLL_INTERVAL) || 5000;
export const API_SYNC_TIMEOUT = Number(process.env.REACT_APP_API_SYNC_TIMEOUT) || 5000;
export const LOGGER_ENABLED = process.env.REACT_APP_LOGGER_ENABLED?.toLowerCase() === 'true';
export const IS_DEMO = Boolean(process.env.REACT_APP_DEMO);