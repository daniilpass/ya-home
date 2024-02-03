
import { Collection, Device, Plan } from '@homemap/shared';

import {API_BASE_URL} from '../constants';

import {Endpoint} from './configuration/types';
import {DEFAULT_HEADERS, ENDPOINTS} from './configuration';

const request = <TResponse>(endpoint: Endpoint, payload?: any) => {
    const resource = `${API_BASE_URL}${endpoint.url}`;
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

const getPlan = (): Promise<Plan>  => {
    return request<Plan>(ENDPOINTS.plan);
}

const ApiClient = {
    ping,
    lightToggle,
    lightOn,
    lightOff,
    getDevices,
    getPlan,
}

export default ApiClient;