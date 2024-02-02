import './config.js';
import { bootstrapDatabase } from './db.js';
import { bootstrapServer } from './server.js';

export const bootstrap = async () => {
    await bootstrapDatabase();
    await bootstrapServer();
}