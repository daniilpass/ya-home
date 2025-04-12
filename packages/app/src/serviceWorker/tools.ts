import { LOGGER_ENABLED } from '../configuration';
import { MESSAGES } from './types';

export const log = (message?: unknown, ...optionalParams: unknown[]) => LOGGER_ENABLED && console.log('[SW]', message, ...optionalParams);
export const error = (message?: unknown, ...optionalParams: unknown[]) => LOGGER_ENABLED && console.error('[SW]', message, ...optionalParams);

export const reloadWithReset = () => {
    navigator.serviceWorker.controller?.postMessage({
        type: MESSAGES.RESET
    });
    window.location.reload();
}