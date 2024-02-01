import { NextFunction, Request, Response } from 'express';

import { Device, DeviceAction, DeviceActionResult } from '@homemap/shared';

import yaclient from '../yaClient/index.js';
import {
    mapYaDeviceToDevice,
    mapDeviceActionToYaDevicesActions,
    mapYaDeviceActionsResultToDeviceActionsResult,
    mapToRecord,
} from '../mappers/index.js';
import { YaDevicesActionsRequest } from '../yaClient/model/requests/YaDevicesActionsRequest.js';
import { YaUserInfoResponse } from '../yaClient/model/responses/YaUserInfoResponse.js';
import { YaDevicesActionsResponse } from '../yaClient/model/responses/YaDevicesActionsResponse.js';

export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response: YaUserInfoResponse = await yaclient.getUserInfo();
        const result: Record<string, Device> = mapToRecord(response.devices, 'id', mapYaDeviceToDevice);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const postDevicesActions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deviceAction: DeviceAction = req.body;
        const deviceActionRequest: YaDevicesActionsRequest = {
            devices: [
                mapDeviceActionToYaDevicesActions(deviceAction)
            ],
        };
    
        const response: YaDevicesActionsResponse = await yaclient.postDevicesActions(deviceActionRequest);
        const result: Record<string, DeviceActionResult> = mapToRecord(
            response.devices,
            'id',
            mapYaDeviceActionsResultToDeviceActionsResult,
        );
        res.json(result);       
    } catch (error) {
        next(error);
    }
}