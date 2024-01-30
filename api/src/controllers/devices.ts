import { Device, DeviceAction } from '@homemap/shared';

import { NextFunction, Request, Response } from 'express';
import yaclient from '../yaClient/index.js';
import { mapYaDeviceToDevice } from '../mappers/index.js';
import { YaDevicesActionsRequest } from '../yaClient/model/YaDevicesActionsRequest.js';
import { mapDeviceActionToYaDevicesActions } from '../mappers/mapDeviceActionToYaDevicesActions.js';

export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const yaUserInfo = await yaclient.getUserInfo();
    
        const devices = yaUserInfo.devices.map<Device>(mapYaDeviceToDevice);
    
        res.json(devices);
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
    
        await yaclient.postDevicesActions(deviceActionRequest);
    
        res.send(true);        
    } catch (error) {
        next(error);
    }
}