import type { NextFunction, Request, Response } from 'express';

import type { Collection, Device, DeviceActionResult } from '@homemap/shared';

import YaService from '../services/yaService';
import ValidationService from '../services/validationService';

export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result: Collection<Device> = await new YaService(req).getUserDevices();

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const postDevicesActions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ValidationService.validateDeviceAction(req.body);
    
        const result: Collection<DeviceActionResult> = await new YaService(req).postDeviceAction(req.body);

        res.json(result);      
    } catch (error) {
        next(error);
    }
}