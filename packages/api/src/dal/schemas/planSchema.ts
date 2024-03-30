import { DataTypes, ModelAttributes } from 'sequelize';

export const planSchema: ModelAttributes = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: DataTypes.STRING,
    json: DataTypes.JSON,
}
