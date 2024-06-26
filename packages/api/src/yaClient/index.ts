import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { YAPI_AUTH_TOKEN, YAPI_IOT_BASE_URL, YAPI_LOGIN_BASE_URL } from '../constants';
import { YaUserInfoResponse } from './model/responses/YaUserInfoResponse';
import { YaDevicesActionsRequest } from './model/requests/YaDevicesActionsRequest';
import { YaDevicesActionsResponse } from './model/responses/YaDevicesActionsResponse';
import { YaLoginInfo } from './model/YaLoginInfo';
import { logger } from '../utils';

const iotClient = axios.create({
    baseURL: YAPI_IOT_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YAPI_AUTH_TOKEN}`,
    }
});

const loginClient = axios.create({
    baseURL: YAPI_LOGIN_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `OAuth ${YAPI_AUTH_TOKEN}`,
    }
});

const logRequest = (config: InternalAxiosRequestConfig) => {
    config.headers['request-time'] = performance.now();
    return config;
}

const logResponse = (response: AxiosResponse) => {
    const method = response.config.method?.toUpperCase();
    const url = response.config.url;
    const status = response.status;
    const contentLength = response.headers['Content-Length'] || 'unknown';
    const responseTime = Math.ceil(performance.now() - Number(response.config.headers['request-time']));

    logger.debug(`[yaClient] ${method}\t${url}\t${status}\t${contentLength} bytes\t${responseTime}ms`);

    return response;
}

iotClient.interceptors.request.use(logRequest);
iotClient.interceptors.response.use(logResponse);
loginClient.interceptors.request.use(logRequest);
loginClient.interceptors.response.use(logResponse);

const getLoginInfo = (): Promise<YaLoginInfo> => {
    return loginClient.get<YaLoginInfo>('/info').then(response => response.data);
}

const getUserInfo = (): Promise<YaUserInfoResponse> => {
    return iotClient.get<YaUserInfoResponse>('/user/info').then(response => response.data);
}

const postDevicesActions = (data: YaDevicesActionsRequest): Promise<YaDevicesActionsResponse> => {
    return iotClient.post<YaDevicesActionsResponse>('/devices/actions', data).then(response => response.data);
}

export default {
    getLoginInfo,
    getUserInfo,
    postDevicesActions,
}