import { Collection, DEFAULT_PLAN, Device, DeviceAction, DeviceActionResult, DeviceStateKeys, DeviceSubtypes, DeviceTypes, isSwitchableDevice, Plan, PlanInfo } from '@homemap/shared';

import { default as planListResponseJson } from '../responses/planList.json' assert { type: "json" };
import { default as planResponseJson } from '../responses/plan.json' assert { type: "json" };
import { default as devicesResponseJson } from '../responses/devices.json' assert { type: "json" };
import { createJsonResponse, getRequestBody } from './tools';
import { DeviceSensor } from '@homemap/shared/src/types/home/devices/DeviceSensor';

export class ResponseFactory {
    static readonly instance = new ResponseFactory();

    planListUrlPattern = /api\/plan$/;
    planUrlPattern = /api\/plan\/\d*/;
    devicesUrlPattern = /api\/devices$/;
    deviceActionUrlPattern = /api\/devices\/actions$/;

    switchableUpdateInterval: number = 3000;
    switchableLastUpdate: number = 0;

    motionUpdateInterval: number = 30000;
    motionLastUpdate: number = 0;
    planMotionSensorIds: string[] = [];

    devicesResponse: Collection<Device> = {};
    planResponse: Plan = DEFAULT_PLAN;
    planListResponse: Collection<PlanInfo> = {};

    constructor() {        
        this.setup();
    }

    setup() {
        this.switchableLastUpdate = Date.now();
        this.motionLastUpdate = 0;
        this.planListResponse = structuredClone(planListResponseJson);
        this.planResponse = structuredClone(planResponseJson) as unknown as Plan;
        this.devicesResponse = structuredClone(devicesResponseJson) as unknown as Collection<Device>;

        for(const device of Object.values(this.devicesResponse)) {
            if (device.type === DeviceTypes.Sensor && device.subtype === DeviceSubtypes.Motion) {
                const minutesAgo = Math.random() * 15;
                const msAgo = minutesAgo * 60 * 1000;
                device.state.motion!.updatedAt = Date.now() - msAgo;
                this.planMotionSensorIds.push(device.id);
            }
        }
    }

    async makeResponse(event: FetchEvent): Promise<Response> {
        const { url, method } = event.request;
    
        if (this.planListUrlPattern.test(url) && method === 'GET') {
            return this.createPlanListResponse();
        }
        
        if (this.planUrlPattern.test(url) && method === 'GET') {
            return this.createPlanResponse();
        }
        
        if (this.planUrlPattern.test(url) && method === 'PUT') {
            const payload = await getRequestBody<Plan>(event);
            if (payload) {
                return this.createPlanUpdateResponse(payload);
            }
        }

        if (this.devicesUrlPattern.test(url) && method === 'GET') {
            return this.createDevicesResponse();
        }
        
        if (this.deviceActionUrlPattern.test(url) && method === 'POST') {
            const payload = await getRequestBody<DeviceAction>(event);
            if (payload) {
                return this.createDeviceActionsResponse(payload);
            }
        }
    
        return fetch(event.request);
    }

    private createPlanListResponse() {
        return createJsonResponse(this.planListResponse);
    }
    
    private createPlanResponse() {
        return createJsonResponse(this.planResponse);
    }

    private createPlanUpdateResponse(payload: Plan) {
        this.planResponse = payload;
        return createJsonResponse(this.planResponse);
    }
    
    private createDevicesResponse() {
        if (Date.now() - this.switchableLastUpdate > this.switchableUpdateInterval) {
            this.switchableLastUpdate = Date.now();
            const deviceIds = Object.keys(this.planResponse.devices);
            const deviceToUpdateId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
            const deviceToUpdate = this.devicesResponse[deviceToUpdateId];
            if (isSwitchableDevice(deviceToUpdate)) {
                this.devicesResponse[deviceToUpdateId].state = {
                    ...deviceToUpdate.state,
                    on: {
                        ...deviceToUpdate.state.on!,
                        value: !deviceToUpdate.state.on!.value,
                    }
                }
            }
        }

        if (Date.now() - this.motionLastUpdate > this.motionUpdateInterval) {
            this.motionLastUpdate = Date.now();
            const sensorIds = this.planMotionSensorIds;
            const deviceToUpdateId = sensorIds[Math.floor(Math.random() * sensorIds.length)];
            const deviceToUpdate = this.devicesResponse[deviceToUpdateId] as DeviceSensor;
            deviceToUpdate.state.motion!.updatedAt = Date.now();
        }

        return createJsonResponse(this.devicesResponse);
    }
    
    private async createDeviceActionsResponse(payload: DeviceAction) {
        this.switchableLastUpdate = Date.now();
    
        const keys = Object.keys(payload.state);
        keys.forEach((key) => {
            // @ts-expect-error
            this.devicesResponse[payload.id].state[key] = {
                // @ts-expect-error
                ...this.devicesResponse[payload.id].state[key],
                // @ts-expect-error
                value: payload.state[key],
            };
        })
    
        // prepare response
        const response: DeviceActionResult = {
            id: payload.id,
            status: {},
        };
    
        const stateKeys = Object.keys(payload.state) as DeviceStateKeys[];
        stateKeys.forEach((key) => {
            response.status[key] = 'DONE';
        });
    
        return createJsonResponse(response);
    }
}
