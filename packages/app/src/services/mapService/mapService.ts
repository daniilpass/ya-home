import type { Collection } from '@homemap/shared';
import { isSwitchableDeviceType } from '@homemap/shared';

import { Logger } from '../../common/tools';
import ApiClient from '../../api';
import { API_POLL_INTERVAL, API_SYNC_TIMEOUT } from '../../configuration';
import { store } from '../../store';

import MapState from './mapState';
import { UNKNOWN_STATE } from './constants';
import type { Element } from './model/Element';
import { Substate } from './model/Substate';
import { PollingState } from './types';

let mapServiceInstanceCounter = 0;

class MapService {
    private id = mapServiceInstanceCounter++;
    private state: MapState;
    private pollInterval: number;
    private pollIntervalId?: number;
    private pollingState: PollingState = PollingState.Stopped;
    private logger = new Logger(`MapService-${this.id}`);

    onUpdate?: (elements: Record<string, Element>) => void;

    constructor(
        elements: Collection<Element> = {},
    ) {
        this.pollInterval = API_POLL_INTERVAL;
        this.state = new MapState(elements, API_SYNC_TIMEOUT);

        this.subscribeToEvents();
    }

    async start() {
        this.pollingState = PollingState.Started;

        this.handleUpdate();

        await this.tick();
    }

    stop() {
        this.pollingState = PollingState.Stopped;

        clearInterval(this.pollIntervalId);
    }

    finalize() {
        this.logger.debug('finalized');

        this.stop();
        this.unsubscribeFromEvents();
    }

    private subscribeToEvents() {
        document.addEventListener('visibilitychange', this.visibilityChanged);
    }

    private unsubscribeFromEvents() {
        document.removeEventListener('visibilitychange', this.visibilityChanged);
    }

    private visibilityChanged = () => {
        this.logger.debug('visibilityChanged to', document.visibilityState);

        if (document.visibilityState === 'hidden') {
            this.stop();
        } else if (this.pollingState === PollingState.Stopped) {
            this.start();
        }
    };

    private async tick() {
        this.logger.debug('tick');
    
        await this.getAndUpdateElementsState();
    
        this.handleUpdate();

        this.scheduleNextTick();
    }

    private scheduleNextTick() {
        if (this.pollingState === PollingState.Stopped) {
            return;
        }

        this.pollIntervalId = window.setTimeout(this.tick.bind(this), this.pollInterval);
    }

    private handleUpdate() {
        this.onUpdate?.(this.state.elements);
    }

    private async getAndUpdateElementsState() {
        await ApiClient
            .getDevices()
            .then((data) => {
                this.state.updateElements(data);
            }).catch(() => {
                this.state.updateElements({});
            });
    }

    actionSwitch(deviceId: string) {
        const device = this.state.elements[deviceId];

        if (!device || device.substate !== Substate.Synced) {
            return;
        }

        if (!isSwitchableDeviceType(device.type)) {
            return;
        }

        const prevState = {
            state: device.state,
            substate: device.substate,
        };

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
                this.logger.error(UNKNOWN_STATE, device.state);
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
