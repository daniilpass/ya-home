const ENDPOINTS = {
    action: {
        method: 'POST',
        url: '/devices/actions',
    },
    devices: {
        method: 'GET',
        url: '/devices',
    },
    plan: {
        method: 'GET',
        url: '/plan',
    },
    savePlan: {
        method: 'PUT',
        url: '/plan/:id',
    },
    ping: {
        method: 'GET',
        url: '/stats/ping',
    }
}

export default ENDPOINTS;