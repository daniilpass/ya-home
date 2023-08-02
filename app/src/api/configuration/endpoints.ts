import {Endpoints} from './types';

const ENDPOINTS: Endpoints = {
    action: {
        method: 'POST',
        url: '/devices/actions',
    },
    homeInfo: {
        method: 'GET',
        url: '/home/info',
    },
    ping: {
        method: 'GET',
        url: '/home/ping',
    }
}

export default ENDPOINTS;