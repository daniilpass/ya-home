import { Collection, DeviceTypes } from '@homemap/shared';

import {logger} from '../../common/tools';
import ApiClient from '../../api';
import {API_POLL_INTERVAL, API_SYNC_TIMEOUT} from '../../configuration';

import MapState from "./mapState";
import {UNKNOWN_STATE} from "./constants";
import {Element} from './model/Element';
import {Substate} from './model/Substate';
import { store } from '../../store';

class MapService {
    state: MapState;
    pollInterval: number;
    pollIntervalId?: number;
    onUpdate?: (elements: Record<string, Element>) => void;

    constructor(
        elements: Collection<Element> = {},
    ) {
        this.pollInterval = API_POLL_INTERVAL;
        this.state = new MapState(elements, API_SYNC_TIMEOUT);
    }

    async start() {
        this.handleUpdate();
        await this.tick();
    }

    stop() {
        clearInterval(this.pollIntervalId);
    }

    async tick() {
        await this.getAndUpdateElementsState();
        this.handleUpdate();
        // Planning next tick
        this.pollIntervalId = window.setTimeout(this.tick.bind(this), this.pollInterval);
    }

    handleUpdate() {
        this.onUpdate && this.onUpdate(this.state.elements);
    }

    async getAndUpdateElementsState() {
        await ApiClient
            .getDevices()
            .then((data) => {
                this.state.updateElements(data);
            }).catch(() => {
                this.state.updateElements({})
            });
    }

    switchLight(deviceId: string) {
        const device = this.state.elements[deviceId];

        if (!device || device.substate !== Substate.Synced) {
            return;
        }

        if (device.type !== DeviceTypes.Light && device.type !== DeviceTypes.Switch) {
            return;
        }

        const prevState = {
            state: device.state,
            substate: device.substate,
        }

        let updatePromise: Promise<void> | undefined;

        switch (device.state?.on?.value) {
            case true:
                this.state.updateElement(deviceId, {
                    state: { 
                        on: {
                            ...device.state?.on,
                            value: false,
                        }
                    },
                    substate: Substate.Pending,
                });

                updatePromise = ApiClient.lightOff(deviceId);
                break;
            case false:
                this.state.updateElement(deviceId, {
                    state: { 
                        on: {
                            ...device.state?.on,
                            value: true,
                        }
                    },
                    substate: Substate.Pending,
                });

                updatePromise = ApiClient.lightOn(deviceId);
                break;
            default:
                logger.error(UNKNOWN_STATE, device.state);
        }

        updatePromise?.then(() => {
            this.state.updateElement(deviceId, {
                substate: Substate.Ready,
            });
        }).catch(() => {
            store.dispatch.alerts.error('Ошибка');
            this.state.updateElement(deviceId, prevState);
        });

        this.handleUpdate();
    }
}

export default MapService;
