import { Sequelize } from 'sequelize';

import { Plan } from '../dal/model/index.js';
import { planSchema } from '../dal/schema/index.js';

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
}

