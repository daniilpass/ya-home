import './config';
import { bootstrapDatabase } from './db';
import { bootstrapServer } from './server';

export const bootstrap = async () => {
    await bootstrapDatabase();
    await bootstrapServer();
}