/// <reference lib="webworker" />

import { ResponseFactory } from '../demo/proxy/ResponseFactory';


export {};
declare let self: ServiceWorkerGlobalScope;

const responseFactory = new ResponseFactory();

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