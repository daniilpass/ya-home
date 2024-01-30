import express from "express";

import { PORT } from './constants.js';
import devicesRouter from './routes/devices.js';
import statsRouter from './routes/stats.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/', devicesRouter);
app.use('/', statsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});