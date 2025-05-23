import { LOGGER_ENABLED } from '../../configuration';

export class Logger {
    enabled = LOGGER_ENABLED;

    constructor(public name: string) {}

    debug(message: string, ...data: unknown[]) {
        if (!this.enabled) return;
        console.debug(`[${this.name}] ${message}`, ...data);
    }

    info(message: string, ...data: unknown[]) {
        if (!this.enabled) return;
        console.info(`[${this.name}] ${message}`, ...data);
    }

    log(message: string, ...data: unknown[]) {
        if (!this.enabled) return;
        console.log(`[${this.name}] ${message}`, ...data);
    }

    warn(message: string, ...data: unknown[]) {
        if (!this.enabled) return;
        console.warn(`[${this.name}] ${message}`, ...data);
    }

    error(message: string, ...data: unknown[]) {
        if (!this.enabled) return;
        console.error(`[${this.name}] ${message}`, ...data);
    }
}

export const loggerInstance = new Logger('Default');
