import { Sequelize } from 'sequelize';

import { Plan as HomePlan } from '@homemap/shared/index.js';

import { Plan } from '../dal/model/index.js';
import { planSchema } from '../dal/schema/index.js';
import planJson from '../demo/plan.json' assert { type: "json" };
import { DEMO_USER_ID } from '../demo/constants.js';

const createDemoData = async () => {
    const [_, created] = await Plan.findOrCreate({
        where: { userId: DEMO_USER_ID},
        defaults: {
            userId: DEMO_USER_ID,
            json: planJson as unknown as HomePlan
        }
    });
    if (created) {
        console.log("[db] Demo data created");
    }
}

export const bootstrapDatabase = async () => {
    console.log("[db] Configure database");

    // Create Sequelize instance
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './appData/db.sqlite'
    });
    
    // Init model
    Plan.init(planSchema, { sequelize, modelName: 'plan' });
    
    // Sync models
    console.log("[db] Sync all defined models started");
    
    await sequelize.sync();
    
    console.log("[db] Sync all defined models completed");

    await createDemoData();
}

