
import { Collection, Device, DeviceAction, Plan, PlanInfo, Token } from '@homemap/shared';

import {API_BASE_URL} from '../configuration';

import {Endpoint} from './configuration/types';
import {DEFAULT_HEADERS, ENDPOINTS} from './configuration';

const request = <TResponse, TPayload = unknown>(endpoint: Endpoint, payload?: TPayload, params?: Record<string, string | number>) => {
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

        return response.json().catch(() => {});
    })
    .then(data => data as TResponse)
    .catch(errorResponse => {
        const { status, statusText } = errorResponse;

        if (status === 401) {
            window.location.href = '/auth';
        }

        const error = `${status}: ${statusText}`;
        throw error;
    })
}

const ping = () => {
    request(ENDPOINTS.ping)
}

const lightToggle = (deviceId: string, value: boolean) => {
    return request<void, DeviceAction>(ENDPOINTS.action, {
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

const getAuthUrl = () => {
    return request<string>(ENDPOINTS.getAuthUrl);
}

const auth = (code: string) => {
    return request<Token>(ENDPOINTS.auth, null, {
        code,
    });
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
    getAuthUrl,
    auth,
}

export default ApiClient;
