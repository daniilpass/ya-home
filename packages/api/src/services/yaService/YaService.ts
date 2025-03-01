import { Request } from 'express';

import { Collection, Device, DeviceAction, DeviceActionResult, Token } from '@homemap/shared';
import { YaClient } from '../../yaClient';
import { YaLoginInfo } from '../../yaClient/model/YaLoginInfo';
import { YaUserInfoResponse } from '../../yaClient/model/responses/YaUserInfoResponse';
import { mapDeviceActionToYaDevicesActions, mapToRecord, mapYaDeviceActionsResultToDeviceActionsResult, mapYaDeviceToDevice } from '../../mappers';
import { YaDevicesActionsRequest } from '../../yaClient/model/requests/YaDevicesActionsRequest';
import { YaDevicesActionsResponse } from '../../yaClient/model/responses/YaDevicesActionsResponse';
import { cache } from '../../utils/cache';
import { getYaToken } from '../../utils/cookie';
import { decryptByClientSecret, encryptTokenByClientSecret } from '../../utils/crypto';

export class YaService {
    private yaClient: YaClient;

    /**
     * Ключ кеширования состояния устройств пользователя.
     * Завязан на токен.
     */
    private cacheDevicesKey: string | undefined;

    constructor(req: Request<unknown, unknown, unknown, unknown>) {
        const encryptedToken = getYaToken(req);

        const token = encryptedToken ? decryptByClientSecret(encryptedToken) : undefined;
        this.yaClient = new YaClient(token);
    
        this.cacheDevicesKey = encryptedToken;
    }

    getUserInfo(): Promise<YaLoginInfo> {
        return this.yaClient.getLoginInfo();
    }
    
    async getUserId(): Promise<string> {
        const { id: userId } = await this.getUserInfo();
        return userId;
    }
    
    async getUserDevices (): Promise<Collection<Device>> {
        let result = this.cacheDevicesKey && cache.get<Collection<Device>>(this.cacheDevicesKey);
    
        if (!result) {
            const response: YaUserInfoResponse = await this.yaClient.getUserInfo();
            result = mapToRecord(response.devices, 'id', mapYaDeviceToDevice);
            this.cacheDevicesKey && cache.set<Collection<Device>>(this.cacheDevicesKey, result);
        }
        
        return result;
    }
    
    async postDeviceAction(deviceAction: DeviceAction): Promise<Collection<DeviceActionResult>> {
        const deviceActionRequest: YaDevicesActionsRequest = {
            devices: [
                mapDeviceActionToYaDevicesActions(deviceAction)
            ],
        };
    
        const response: YaDevicesActionsResponse = await this.yaClient.postDevicesActions(deviceActionRequest);
        const result: Collection<DeviceActionResult> = mapToRecord(
            response.devices,
            'id',
            mapYaDeviceActionsResultToDeviceActionsResult,
        );
    
        return result;
    }
    
    async getToken(code: string): Promise<Token> {
        const token = await this.yaClient.getToken(code);
        return encryptTokenByClientSecret(token);
    }
    
    getAuthUrl(): string {
        return this.yaClient.getAuthUrl();
    }
}
