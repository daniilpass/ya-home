import {LOGGER_ENABLED} from '../../constants';

class Logger {
    enabled = LOGGER_ENABLED;

    debug(...data: any[]) {
        this.enabled && console.debug(...data);
    }

    info(...data: any[]) {
        this.enabled && console.info(...data);
    }

    log(...data: any[]) {
        this.enabled && console.log(...data);
    }

    warn(...data: any[]) {
        this.enabled && console.warn(...data);
    }

    error(...data: any[]) {
        this.enabled && console.error(...data);
    }
}

export const loggerInstance = new Logger();
