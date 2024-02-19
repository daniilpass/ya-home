import { log, error } from './tools';

const SW_URL = `${process.env.PUBLIC_URL}/service-worker.js`;

const registerServiceWorker = async (swUrl: string): Promise<void> => {
    const isSWSupported = "serviceWorker" in navigator;
    if (!isSWSupported) {
        log('Service worker not supported by browser');
        return;
    }

    try {
        log(`Registering service worker`);
        const registration = await navigator.serviceWorker.register(swUrl);

        if (registration.installing) {
            log("Service worker installing");
        } else if (registration.waiting) {
            log("Service worker installed");
        } else if (registration.active) {
            log("Service worker active");
        }
    } catch (err) {
        error(`Service worker registration failed with ${error}`);
    }
};

export const register = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        window.addEventListener("load", () => {
            registerServiceWorker(SW_URL)
                .then(resolve)
                .catch(reject);
        });
    });
};

export const unregister = async () => {
    try {
        log(`Unregistering service worker, don't forget to close all application tabs`);
        const registrations = await navigator.serviceWorker.getRegistrations();
        for(let registration of registrations) {
            await registration.unregister();
        }
    } catch (err) {
        error(`Service worker unregister failed with ${error}`);
    }
};
