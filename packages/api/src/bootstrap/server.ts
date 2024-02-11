import express from "express";

import { PORT } from '../constants';

import { errorHandler, requestLogger } from '../middlewares';
import { devicesRouter, loginRouter, planRouter, statsRouter, mediaRouter } from '../routes';
import { logger } from '../utils';

export const bootstrapServer = () => {
    logger.info("[server] Configure express");

    const app = express();
    
    app.use(requestLogger);
    app.use(express.json({
        limit: '10mb'
    }));
    
    app.use('/', loginRouter);
    app.use('/', devicesRouter);
    app.use('/', planRouter);
    app.use('/', statsRouter);
    app.use('/', mediaRouter);

    app.use(errorHandler);
    
    app.listen(PORT, () => {
      logger.info(`[server] Server is running at http://localhost:${PORT}`);
    });
}
