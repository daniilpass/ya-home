import {logger} from '../tools';

import {API_BASE_URL} from '../constants';

import {Headers, Endpoints, Endpoint} from './configuration/types';
import {DEFAULT_HEADERS, ENDPOINTS} from './configuration';
import {REQUEST_SUCCESS, REQUEST_ERROR} from './constants';
import {DeviceCollection} from './model/Device';
import {HomeState} from './model/HomeState';

class ApiClient {
    host: string;
    headers: Headers;
    endpoints: Endpoints;

    constructor() {
        this.host = API_BASE_URL;
        this.headers = DEFAULT_HEADERS;
        this.endpoints = ENDPOINTS;
    }

    log(status: string, url: string, startTs: number, error = '') {
        logger.debug(status, url, error, `${Date.now() - startTs} ms`);
    }

    request<TResponse>(endpoint: Endpoint, payload?: any) {
        const startTs = Date.now();
        const resource = `${this.host}${endpoint.url}`;
        return fetch(resource, {
            method: endpoint.method,
            headers: this.headers,
            body: payload ? JSON.stringify(payload) : null,
        }).then(response => {
            this.log(REQUEST_SUCCESS, resource, startTs);
            return response.json();
        })
        .then(data => data as TResponse)
        .catch(error => {
            this.log(REQUEST_ERROR, resource, startTs, error);
            throw error;
        })
    }

    lightTurnOnOff(entityId: string, value: boolean) {
        return this.request(this.endpoints.action, {
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

    lightTurnOn(entityId: string) {
        return this.lightTurnOnOff(entityId, true);
    }

    lightTurnOff(entityId: string) {
        return this.lightTurnOnOff(entityId, false);
    }

    getHomeState(): Promise<HomeState> {
        return this.request<DeviceCollection>(this.endpoints.homeInfo)
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

    ping() {
        this.request(this.endpoints.ping)
    }
}

export default ApiClient;
