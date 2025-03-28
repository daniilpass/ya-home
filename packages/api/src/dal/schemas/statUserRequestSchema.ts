import { DataTypes, ModelAttributes } from 'sequelize';

export const statUserRequestSchema: ModelAttributes = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: DataTypes.STRING(36),
    route: DataTypes.STRING,
    path: DataTypes.STRING,
    method: DataTypes.STRING(7),
    statusCode: DataTypes.NUMBER,
    timestamp: DataTypes.NUMBER,
    duration: DataTypes.NUMBER,
    userAddress: DataTypes.STRING(45),
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}
