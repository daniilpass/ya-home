import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { PORT } from '../constants';

import { devicesRouter, loginRouter, planRouter, statsRouter, mediaRouter, authRouter } from '../routes';
import { auth, errorHandler, requestLogger, requestStatistics } from '../middlewares';
import { logger } from '../utils';

export const bootstrapServer = () => {
    logger.info("[server] Configure express");

    const app = express();

    app.use(requestStatistics);

    app.use(compression());

    app.use(requestLogger);

    app.use(express.json({
        limit: '10mb'
    }));

    app.use(cookieParser())

    // Allow anonymous access
    // to Auth
    app.use('/api', authRouter);
    // to Status
    app.use('/api', statsRouter);

    // Enable auth
    app.use(auth);

    app.use('/api', loginRouter);
    app.use('/api', devicesRouter);
    app.use('/api', planRouter);
    app.use('/api', mediaRouter);

    app.use(errorHandler);

    app.listen(PORT, () => {
      logger.info(`[server] Server is running at http://localhost:${PORT}`);
    });
}
