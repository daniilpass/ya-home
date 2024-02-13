
import { Collection, Device, Plan, PlanInfo } from '@homemap/shared';

import {API_BASE_URL} from '../constants';

import {Endpoint} from './configuration/types';
import {DEFAULT_HEADERS, ENDPOINTS} from './configuration';

const request = <TResponse>(endpoint: Endpoint, payload?: any, params?: Record<string, string | number>) => {
    let resource = `${API_BASE_URL}${endpoint.url}`;
    if (params) {
        for(const [key, value] of Object.entries(params)) {
            resource = resource.replace(`:${key}`, value.toString());
        }
    }

    return fetch(resource, {
        method: endpoint.method,
        headers: DEFAULT_HEADERS,
        body: payload ? JSON.stringify(payload) : undefined,
    }).then(response => {
        if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
    })
    .then(data => data as TResponse)
    .catch(errorResponse => {
        const error = `${errorResponse.status}: ${errorResponse.statusText}`;
        throw error;
    })
}

const ping = () => {
    request(ENDPOINTS.ping)
}

const lightToggle = (deviceId: string, value: boolean) => {
    return request(ENDPOINTS.action, {
        id: deviceId,
        state: {
            on: value,
        },
    });
}

const lightOn = (deviceId: string) => {
    return lightToggle(deviceId, true);
}

const lightOff = (deviceId: string) => {
    return lightToggle(deviceId, false);
}

const getDevices = (): Promise<Collection<Device>> => {
    return request<Collection<Device>>(ENDPOINTS.devices);
}

const getPlan = (planId: number): Promise<Plan>  => {
    return request<Plan>(ENDPOINTS.getPlanById, null, {
        id: planId
    });
}

const getPlans = (): Promise<Collection<PlanInfo>>  => {
    return request<Collection<PlanInfo>>(ENDPOINTS.getPlans);
}

const updatePlan = (planId: number, plan: Plan): Promise<Plan> => {
    return request<Plan>(ENDPOINTS.updatePlan, plan, {
        id: planId
    });
}

const createPlan = (plan: Plan): Promise<Plan> => {
    return request<Plan>(ENDPOINTS.createPlan, plan);
}

const getMediaUrl = (mediaId: string) => {
    return `${API_BASE_URL}${ENDPOINTS.media.url}/${mediaId}`
}

const ApiClient = {
    ping,
    lightToggle,
    lightOn,
    lightOff,
    getDevices,
    getPlan,
    getPlans,
    updatePlan,
    createPlan,
    getMediaUrl,
}

export default ApiClient;
