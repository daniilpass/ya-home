import { Collection, Device, DeviceAction, DeviceActionResult, Token } from '@homemap/shared';
import yaClient from '../../yaClient';
import { YaLoginInfo } from '../../yaClient/model/YaLoginInfo';
import { YaUserInfoResponse } from '../../yaClient/model/responses/YaUserInfoResponse';
import { mapDeviceActionToYaDevicesActions, mapToRecord, mapYaDeviceActionsResultToDeviceActionsResult, mapYaDeviceToDevice } from '../../mappers';
import { YaDevicesActionsRequest } from '../../yaClient/model/requests/YaDevicesActionsRequest';
import { YaDevicesActionsResponse } from '../../yaClient/model/responses/YaDevicesActionsResponse';
import { cache } from '../../utils/cache';

/**
 * Ключ кеширования состояни устройств пользователя.
 * Константа, пока нет подддержки нескольких пользователей.
 */
const CACHE_KEY_DEVICES = 'user_devices';

const getUserInfo = async (): Promise<YaLoginInfo> => {
    return yaClient.getLoginInfo();
}

const getUserId = async (): Promise<string> => {
    const { id: userId } = await getUserInfo();
    return userId;
}

const getUserDevices = async (): Promise<Collection<Device>> => {
    let result = cache.get<Collection<Device>>(CACHE_KEY_DEVICES);

    if (!result) {
        const response: YaUserInfoResponse = await yaClient.getUserInfo();
        result = mapToRecord(response.devices, 'id', mapYaDeviceToDevice);
        cache.set<Collection<Device>>(CACHE_KEY_DEVICES, result);
    }
    
    return result;
}

const postDeviceAction = async (deviceAction: DeviceAction): Promise<Collection<DeviceActionResult>> => {
    const deviceActionRequest: YaDevicesActionsRequest = {
        devices: [
            mapDeviceActionToYaDevicesActions(deviceAction)
        ],
    };

    const response: YaDevicesActionsResponse = await yaClient.postDevicesActions(deviceActionRequest);
    const result: Collection<DeviceActionResult> = mapToRecord(
        response.devices,
        'id',
        mapYaDeviceActionsResultToDeviceActionsResult,
    );

    return result;
}

export const getToken = (code: string): Promise<Token> => {
    return yaClient.getToken(code);
}

export const getAuthUrl = (): string => {
    return yaClient.getAuthUrl();
}

export const YaService = {
    getToken,
    getAuthUrl,
    getUserInfo,
    getUserId,
    getUserDevices,
    postDeviceAction,
}