/// <reference lib="webworker" />

import { ResponseFactory } from '../demo/proxy/ResponseFactory';
import { MESSAGES } from './types';


export {};
declare let self: ServiceWorkerGlobalScope;

let responseFactory = new ResponseFactory();

self.addEventListener('install', (event) => {
    // Needs to activate updated SW immediately
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    // Needs to activate updated SW immediately
    return self.clients.claim();
});


self.addEventListener('fetch', async (event) => {
    event.respondWith(
        responseFactory.makeResponse(event)
    );
});

self.addEventListener('message', async (event) => {
    if (event.data && event.data.type === MESSAGES.RESET) {
        responseFactory.reset();
    }
});