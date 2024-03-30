import path from 'path';
import { Sequelize } from 'sequelize';

import { PlanEntity } from '../dal/entities';
import { planSchema } from '../dal/schemas';
import { logger } from '../utils';
import { DB_STORAGE_PATH } from '../constants';

export const bootstrapDatabase = async () => {
    logger.info("[database] Configure database");

    // Create Sequelize instance
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(DB_STORAGE_PATH, 'db.sqlite'),
        logging: (message) => logger.debug(`[database] ${message}`),
    });
    
    // Init model
    PlanEntity.init(planSchema, { sequelize, modelName: 'plan' });
    
    // Sync models
    logger.info("[database] Sync all defined models started");
    
    await sequelize.sync();
    
    logger.info("[database] Sync all defined models completed");
}

