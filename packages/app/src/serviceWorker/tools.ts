import { LOGGER_ENABLED } from '../configuration';

export const log = (message?: any, ...optionalParams: any[]) => LOGGER_ENABLED && console.log('[SW]', message, ...optionalParams);
export const error = (message?: any, ...optionalParams: any[]) => LOGGER_ENABLED && console.error('[SW]', message, ...optionalParams);