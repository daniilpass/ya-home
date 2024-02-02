
import { Collection, Device, Plan } from '@homemap/shared';

import {logger} from '../common/tools';
import {API_BASE_URL} from '../constants';

import {Endpoint} from './configuration/types';
import {DEFAULT_HEADERS, ENDPOINTS} from './configuration';
import {REQUEST_SUCCESS, REQUEST_ERROR} from './constants';

const log = (status: string, url: string, startTs: number, error = '') => {
    logger.debug(status, url, error, `${Date.now() - startTs} ms`);
}

const request = <TResponse>(endpoint: Endpoint, payload?: any) => {
    const startTs = Date.now();
    const resource = `${API_BASE_URL}${endpoint.url}`;
    return fetch(resource, {
        method: endpoint.method,
        headers: DEFAULT_HEADERS,
        body: payload ? JSON.stringify(payload) : undefined,
    }).then(response => {
        if (!response.ok) {
            return Promise.reject(response);
        }
        log(REQUEST_SUCCESS, resource, startTs);
        return response.json();
    })
    .then(data => data as TResponse)
    .catch(errorResponse => {
        const error = `${errorResponse.status}: ${errorResponse.statusText}`
        log(REQUEST_ERROR, resource, startTs, error);
        throw error;
    })
}

const ping = () => {
    request(ENDPOINTS.ping)
}

const lightToggle = (deviceId: string, value: boolean) => {
    return request(ENDPOINTS.action, {
        devices: [{
            id: deviceId,
            actions: [{
                type: "devices.capabilities.on_off",
                state: {
                    instance: "on",
                    value
                }
            }]
        }]
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
