import { DataTypes, ModelAttributes } from 'sequelize';

export const planSchema: ModelAttributes = {
    userId: DataTypes.STRING,
    json: DataTypes.JSON,
}
