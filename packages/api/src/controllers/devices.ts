import { NextFunction, Request, Response } from 'express';

import { Collection, Device, DeviceAction, DeviceActionResult } from '@homemap/shared';

import yaclient from '../yaClient';
import {
    mapYaDeviceToDevice,
    mapDeviceActionToYaDevicesActions,
    mapYaDeviceActionsResultToDeviceActionsResult,
    mapToRecord,
} from '../mappers';
import { YaDevicesActionsRequest } from '../yaClient/model/requests/YaDevicesActionsRequest';
import { YaUserInfoResponse } from '../yaClient/model/responses/YaUserInfoResponse';
import { YaDevicesActionsResponse } from '../yaClient/model/responses/YaDevicesActionsResponse';

export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response: YaUserInfoResponse = await yaclient.getUserInfo();
        const result: Collection<Device> = mapToRecord(response.devices, 'id', mapYaDeviceToDevice);
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
        const result: Collection<DeviceActionResult> = mapToRecord(
            response.devices,
            'id',
            mapYaDeviceActionsResultToDeviceActionsResult,
        );
        res.json(result);       
    } catch (error) {
        next(error);
    }
}