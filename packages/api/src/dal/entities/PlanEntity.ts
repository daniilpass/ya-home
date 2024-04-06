import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { DeviceSubtypes, DeviceTypes, Plan, PlanInfo } from '@homemap/shared';

import MediaStorage from '../../services/mediaStorage';

export class PlanEntity extends Model<InferAttributes<PlanEntity>, InferCreationAttributes<PlanEntity>> {
    declare id: CreationOptional<number>;
    declare userId: string;
    declare json: Omit<Plan, 'id'>;

    toModel(): Plan {
        return {
            id: this.id,
            width: this.json.width,
            height: this.json.height,
            devices: {
                ...this.json.devices,
                // TODO: mock for sensor
                'dc99174a-2732-449a-b036-6c438a6d0423': {
                    id: 'dc99174a-2732-449a-b036-6c438a6d0423',
                    name: 'Климат в кабинете Д',
                    type: DeviceTypes.Sensor,
                    subtype: DeviceSubtypes.Climate,
                    position: [950, 250],
                },
                '988c57f0-17e4-4806-891e-9ce4775d7293': {
                    id: '988c57f0-17e4-4806-891e-9ce4775d7293',
                    name: 'Климат в кабинете А',
                    type: DeviceTypes.Sensor,
                    subtype: DeviceSubtypes.Climate,
                    position: [950, 550],
                }
            },
            background: {
                ...this.json.background,
                ...(
                    this.json.background.image 
                    ? { image: MediaStorage.getMediaUrl(this.json.background.image) } 
                    : undefined
                ),
            }
        }
    }

    toModelShort (): PlanInfo {
        return {
            id: this.id,
            width: this.json.width,
            height: this.json.height,
            background: {
                ...this.json.background,
                ...(
                    this.json.background.image 
                    ? { image: MediaStorage.getMediaUrl(this.json.background.image) } 
                    : undefined
                ),
            }
        }
    }
}
