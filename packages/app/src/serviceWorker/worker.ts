/// <reference lib="webworker" />
import { log } from './tools';

export {};
declare let self: ServiceWorkerGlobalScope;

self.addEventListener('install', (e) => {
    log(e.type);
    // Needs to activate updated SW immediately
    self.skipWaiting(); 
});

self.addEventListener('activate', (e) => {
    log(e.type);
    // Needs to activate updated SW immediately
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    log(e.type, e.request);
});