import morgan from 'morgan';

import { logger } from '../utils';

const stream = {
    write: (message: any) => logger.http(message),
};

export const requestLogger = morgan(
    "[server] :method\t:url\t:status\t:res[content-length] bytes\t:response-time ms",
    { stream },
);