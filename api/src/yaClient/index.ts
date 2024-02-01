import axios from 'axios';

import { YAPI_AUTH_TOKEN, YAPI_IOT_BASE_URL, YAPI_LOGIN_BASE_URL } from '../constants.js';
import { YaUserInfoResponse } from './model/responses/YaUserInfoResponse.js';
import { YaDevicesActionsRequest } from './model/requests/YaDevicesActionsRequest.js';
import { YaDevicesActionsResponse } from './model/responses/YaDevicesActionsResponse.js';
import { YaLoginInfo } from './model/YaLoginInfo.js';

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