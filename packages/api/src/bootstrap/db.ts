import path from 'path';
import { Sequelize } from 'sequelize';

import { Plan } from '@homemap/shared';

import { PlanEntity } from '../dal/entities';
import { planSchema } from '../dal/schemas';
import planJson from '../demo/plan.json' assert { type: "json" };
import { DEMO_USER_ID } from '../demo/constants';
import { logger } from '../utils';
import { DB_STORAGE_PATH } from '../constants';

const createDemoData = async () => {
    const [_, created] = await PlanEntity.findOrCreate({
        where: { userId: DEMO_USER_ID},
        defaults: {
            userId: DEMO_USER_ID,
            json: planJson as unknown as Plan
        }
    });
    if (created) {
        logger.info("[database] Demo data created");
    }
}

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

    await createDemoData();
}

