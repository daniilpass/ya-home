import { log, error } from './tools';

// TODO: check and fix this
const SW_URL = `/service-worker.js`;

const supported = () => "serviceWorker" in navigator;

const registerServiceWorker = async (swUrl: string): Promise<void> => {
    if (!supported()) {
        throw new Error('Service worker not supported by browser');
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
        error(`Service worker registration failed: ${err}`)
        throw new Error('Service worker registration failed');
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
    if (!supported()) {
        return;
    }

    try {
        log(`Unregistering service worker, don't forget to close all application tabs`);
        const registrations = await navigator.serviceWorker.getRegistrations();
        for(let registration of registrations) {
            await registration.unregister();
        }
    } catch (err) {
        error(`Service worker unregister failed with ${err}`);
    }
};
