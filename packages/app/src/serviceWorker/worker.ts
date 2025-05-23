/// <reference lib="webworker" />

import { ResponseFactory } from '../demo/proxy/ResponseFactory';

import { MESSAGES } from './types';


export {};
declare let self: ServiceWorkerGlobalScope;

const responseFactory = new ResponseFactory();

self.addEventListener('install', () => {
    // Needs to activate updated SW immediately
    self.skipWaiting(); 
});

self.addEventListener('activate', () => {
    // Needs to activate updated SW immediately
    return self.clients.claim();
});


self.addEventListener('fetch', async (event) => {
    const url = new URL(event.request.url);
    if (!url.pathname.startsWith('/api')) {
        return false;
    }

    event.respondWith(
        responseFactory.makeResponse(event)
    );
});

self.addEventListener('message', async (event) => {
    if (event.data && event.data.type === MESSAGES.RESET) {
        responseFactory.setup();
    }
});