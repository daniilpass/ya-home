import express from "express";

import { PORT } from '../constants.js';

import { errorHandler } from '../middlewares/errorHandler.js';
import { devicesRouter, loginRouter, planRouter, statsRouter } from '../routes/index.js';

export const bootstrapServer = () => {
    console.log("[server] Configure express");

    const app = express();
    
    app.use(express.json());
    
    app.use('/', loginRouter);
    app.use('/', devicesRouter);
    app.use('/', planRouter);
    app.use('/', statsRouter);
    
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      console.log(`[server] Server is running at http://localhost:${PORT}`);
    });
}
