import axios from 'axios';

import { YAPI_AUTH_TOKEN, YAPI_BASE_URL } from '../constants.js';
import { YaUserInfoResponse } from './model/responses/YaUserInfoResponse.js';
import { YaDevicesActionsRequest } from './model/requests/YaDevicesActionsRequest.js';
import { YaDevicesActionsResponse } from './model/responses/YaDevicesActionsResponse.js';

const client = axios.create({
    baseURL: YAPI_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YAPI_AUTH_TOKEN}`,
    }
});

const getUserInfo = (): Promise<YaUserInfoResponse> => {
    return client.get<YaUserInfoResponse>('/user/info').then(response => response.data);
}

const postDevicesActions = (data: YaDevicesActionsRequest): Promise<YaDevicesActionsResponse> => {
    return client.post<YaDevicesActionsResponse>('/devices/actions', data).then(response => response.data);
}

export default {
    getUserInfo,
    postDevicesActions,
}