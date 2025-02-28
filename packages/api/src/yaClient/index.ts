import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { YAPI_CLIENT_ID, YAPI_CLIENT_SECRET, YAPI_IOT_BASE_URL, YAPI_LOGIN_BASE_URL, YAPI_OAUTH_BASE_URL } from '../constants';
import { YaUserInfoResponse } from './model/responses/YaUserInfoResponse';
import { YaDevicesActionsRequest } from './model/requests/YaDevicesActionsRequest';
import { YaDevicesActionsResponse } from './model/responses/YaDevicesActionsResponse';
import { YaTokenResponse } from './model/responses/YaTokenResponse';
import { YaLoginInfo } from './model/YaLoginInfo';
import { logger } from '../utils';

export class YaClient {
    private iotClient: AxiosInstance;
    private loginClient: AxiosInstance;

    constructor(token: string | undefined) {
        this.iotClient = axios.create({
            baseURL: YAPI_IOT_BASE_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : undefined),
            }
        });
        this.iotClient.interceptors.request.use(this.logRequest);
        this.iotClient.interceptors.response.use(this.logResponse);
        
        this.loginClient = axios.create({
            baseURL: YAPI_LOGIN_BASE_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(token ? {'Authorization': `OAuth ${token}` } : undefined),
            }
        });
        this.loginClient.interceptors.request.use(this.logRequest);
        this.loginClient.interceptors.response.use(this.logResponse);
    }

    private logRequest = (config: InternalAxiosRequestConfig) => {
        config.headers['request-time'] = performance.now();
        return config;
    }

    private logResponse = (response: AxiosResponse) => {
        const method = response.config.method?.toUpperCase();
        const url = response.config.url;
        const status = response.status;
        const contentLength = response.headers['Content-Length'] || 'unknown';
        const responseTime = Math.ceil(performance.now() - Number(response.config.headers['request-time']));

        logger.debug(`[yaClient] ${method}\t${url}\t${status}\t${contentLength} bytes\t${responseTime}ms`);

        return response;
    }

    getAuthUrl() {
        return `${YAPI_OAUTH_BASE_URL}/authorize?force_confirm=true&response_type=code&client_id=${YAPI_CLIENT_ID}`;
    }

    getToken(code: string): Promise<YaTokenResponse> {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', YAPI_CLIENT_ID);
        params.append('client_secret', YAPI_CLIENT_SECRET);

        return axios.post<YaTokenResponse>(`${YAPI_OAUTH_BASE_URL}/token`, params).then(response => response.data);
    }

    getLoginInfo(): Promise<YaLoginInfo> {
        return this.loginClient.get<YaLoginInfo>('/info').then(response => response.data);
    }

    getUserInfo(): Promise<YaUserInfoResponse> {
        return this.iotClient.get<YaUserInfoResponse>('/user/info').then(response => response.data);
    }

    postDevicesActions(data: YaDevicesActionsRequest): Promise<YaDevicesActionsResponse> {
        return this.iotClient.post<YaDevicesActionsResponse>('/devices/actions', data).then(response => response.data);
    }
}