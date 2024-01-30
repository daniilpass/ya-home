import axios from 'axios';

import { YAPI_AUTH_TOKEN, YAPI_BASE_URL } from '../constants.js';
import { YaUserInfo } from './model/YaUserInfo.js';
import { YaDevicesActionsRequest } from './model/YaDevicesActionsRequest.js';

const client = axios.create({
    baseURL: YAPI_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YAPI_AUTH_TOKEN}`,
    }
});

const getUserInfo = () => {
    return client.get<YaUserInfo>('/user/info').then(response => response.data);
}

const postDevicesActions = (data: YaDevicesActionsRequest) => {
    return client.post('/devices/actions', data).then(response => response.data);
}

export default {
    getUserInfo,
    postDevicesActions,
}