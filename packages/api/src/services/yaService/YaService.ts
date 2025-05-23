import type { Request } from 'express';

import type { Collection, Device, DeviceAction, DeviceActionResult, Token } from '@homemap/shared';

import { YaClient } from '../../yaClient';
import type { YaLoginInfo } from '../../yaClient/model/YaLoginInfo';
import type { YaUserInfoResponse } from '../../yaClient/model/responses/YaUserInfoResponse';
import { mapDeviceActionToYaDevicesActions, mapToRecord, mapYaDeviceActionsResultToDeviceActionsResult, mapYaDeviceToDevice } from '../../mappers';
import type { YaDevicesActionsRequest } from '../../yaClient/model/requests/YaDevicesActionsRequest';
import type { YaDevicesActionsResponse } from '../../yaClient/model/responses/YaDevicesActionsResponse';
import { cache } from '../../utils/cache';

export class YaService {
    private yaClient: YaClient;

    /**
     * Ключ кеширования состояния устройств пользователя.
     * Завязан на userId.
     */
    private cacheDevicesKey: string | undefined;

    constructor(req: Request<unknown, unknown, unknown, unknown>) {
        this.yaClient = new YaClient(req.userInfo?.yaToken?.access_token);
        this.cacheDevicesKey = req.userInfo?.yaUserId;
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
    
            if (this.cacheDevicesKey) {
                cache.set<Collection<Device>>(this.cacheDevicesKey, result);
            }
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
        return await this.yaClient.getToken(code);
    }
    
    getAuthUrl(): string {
        return this.yaClient.getAuthUrl();
    }
}
