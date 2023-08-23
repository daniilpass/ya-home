import {logger} from '../tools';

import {API_BASE_URL} from '../constants';

import {Endpoint} from './configuration/types';
import {DEFAULT_HEADERS, ENDPOINTS} from './configuration';
import {REQUEST_SUCCESS, REQUEST_ERROR} from './constants';
import {DeviceCollection} from './model/Device';
import {HomeDeviceCollection} from './model/HomeDevice';


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

const lightToggle = (entityId: string, value: boolean) => {
    return request(ENDPOINTS.action, {
        devices: [{
            id: entityId,
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

const lightOn = (entityId: string) => {
    return lightToggle(entityId, true);
}

const lightOff = (entityId: string) => {
    return lightToggle(entityId, false);
}

const getDevices = (): Promise<HomeDeviceCollection> => {
    return request<DeviceCollection>(ENDPOINTS.homeInfo)
        .then(({devices}) => {
            return Object.fromEntries(
                devices.map(device => {
                    const deviceState = device.capabilities[0]?.state;
                    const state = deviceState ? `${deviceState.instance}:${deviceState.value}` : undefined;
                    return [
                        device.id,
                        {
                            id: device.id,
                            name: device.name,
                            type: device.type,
                            state,
                        },                    
                    ]
                })
            );
        });
}

const ApiClient = {
    ping,
    lightToggle,
    lightOn,
    lightOff,
    getDevices,
}

export default ApiClient;
