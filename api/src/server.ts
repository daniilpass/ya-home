import express from "express";

import { PORT } from './constants.js';
import devicesRouter from './routes/devices.js';
import statsRouter from './routes/stats.js';

const app = express();

app.use(express.json());

app.use('/', devicesRouter);
app.use('/', statsRouter);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});