class Logger {
    enabled = false;

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
