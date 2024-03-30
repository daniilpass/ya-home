import cloneDeep from 'lodash.clonedeep'
import { Collection, Device, DeviceAction, DeviceActionResult, DeviceStateKeys, Plan, PlanInfo } from '@homemap/shared';

import { default as planListResponseJson } from '../responses/planList.json' assert { type: "json" };
import { default as planResponseJson } from '../responses/plan.json' assert { type: "json" };
import { default as devicesResponseJson } from '../responses/devices.json' assert { type: "json" };
import { createJsonResponse, getRequestBody } from './tools';

export class ResponseFactory {
    static readonly instance = new ResponseFactory();

    planListUrlPattern = /api\/plan$/;
    planUrlPattern = /api\/plan\/\d*/;
    devicesUrlPattern = /api\/devices$/;
    deviceActionUrlPattern = /api\/devices\/actions$/;
    updateInterval: number = 3000;
    lastUpdate: number;
    devicesResponse: Collection<Device>;
    planResponse: Plan;
    planListResponse: Collection<PlanInfo>;

    constructor() {        
        this.lastUpdate = Date.now();
        this.planListResponse = cloneDeep(planListResponseJson);
        this.planResponse = cloneDeep(planResponseJson) as unknown as Plan;
        this.devicesResponse = cloneDeep(devicesResponseJson);
    }

    reset() {
        this.lastUpdate = Date.now();
        this.planListResponse = cloneDeep(planListResponseJson);
        this.planResponse = cloneDeep(planResponseJson) as unknown as Plan;
        this.devicesResponse = cloneDeep(devicesResponseJson);
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
        if (Date.now() - this.lastUpdate > this.updateInterval) {
            this.lastUpdate = Date.now();
            const deviceIds = Object.keys(this.planResponse.devices);
            const deviceToUpdateId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
            const deviceToUpdate = this.devicesResponse[deviceToUpdateId];
            this.devicesResponse[deviceToUpdateId].state = {
                ...deviceToUpdate.state,
                on: !deviceToUpdate.state?.on,
            }
        }
        return createJsonResponse(this.devicesResponse);
    }
    
    private async createDeviceActionsResponse(payload: DeviceAction) {
        this.lastUpdate = Date.now();
    
        // update model
        this.devicesResponse[payload.id].state = {
            ...payload.state,
        }
    
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
