import { Sequelize } from 'sequelize';

import { Plan as HomePlan } from '@homemap/shared';

import { Plan } from '../dal/model';
import { planSchema } from '../dal/schema';
import planJson from '../demo/plan.json' assert { type: "json" };
import { DEMO_USER_ID } from '../demo/constants';
import { logger } from '../utils';

const createDemoData = async () => {
    const [_, created] = await Plan.findOrCreate({
        where: { userId: DEMO_USER_ID},
        defaults: {
            userId: DEMO_USER_ID,
            json: planJson as unknown as HomePlan
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
        storage: './appData/db.sqlite',
        logging: (message) => logger.debug(`[database] ${message}`),
    });
    
    // Init model
    Plan.init(planSchema, { sequelize, modelName: 'plan' });
    
    // Sync models
    logger.info("[database] Sync all defined models started");
    
    await sequelize.sync();
    
    logger.info("[database] Sync all defined models completed");

    await createDemoData();
}

