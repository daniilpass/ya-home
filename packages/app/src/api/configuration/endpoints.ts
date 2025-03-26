const ENDPOINTS = {
    action: {
        method: 'POST',
        url: '/devices/actions',
    },
    devices: {
        method: 'GET',
        url: '/devices',
    },
    getPlans: {
        method: 'GET',
        url: '/plan',
    },
    getPlanById: {
        method: 'GET',
        url: '/plan/:id',
    },
    updatePlan: {
        method: 'PUT',
        url: '/plan/:id',
    },
    createPlan: {
        method: 'POST',
        url: '/plan',
    },
    media: {
        url: '/media',
    },
    ping: {
        method: 'GET',
        url: '/stats/ping',
    },
    getAuthUrl: {
        method: 'GET',
        url: '/auth/url',
    },
    auth: {
        method: 'HEAD',
        url: '/auth?code=:code',
    },
    authRefresh: {
        method: 'HEAD',
        url: '/auth/refresh',
    },
}

export default ENDPOINTS;