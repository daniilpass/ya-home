import { Collection, DeviceTypes } from '@homemap/shared';

import {logger} from '../../common/tools';
import ApiClient from '../../api';
import {API_POLL_INTERVAL, API_SYNC_TIMEOUT} from '../../constants';

import MapState from "./mapState";
import {UNKNOWN_STATE} from "./constants";
import {Element} from './model/Element';
import {Substate} from './model/Substate';

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
        this.pollIntervalId = window.setInterval(this.tick.bind(this), this.pollInterval);
    }

    stop() {
        clearInterval(this.pollIntervalId);
    }

    async tick() {
        await this.getAndUpdateElementsState();
        this.handleUpdate();
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
        const element = this.state.elements[deviceId];

        if (!element || element.substate !== Substate.Synced) {
            return;
        }

        if (element.type !== DeviceTypes.Light && element.type !== DeviceTypes.Switch) {
            return;
        }

        switch (element.state?.on) {
            case true:
                ApiClient.lightOff(deviceId).then(() => {
                    this.state.updateElement(deviceId, {
                        substate: Substate.Ready,
                    });
                });
                this.state.updateElement(deviceId, {
                    state: { on: false },
                    substate: Substate.Pending,
                });
                break;
            case false:
                ApiClient.lightOn(deviceId).then(() => {
                    this.state.updateElement(deviceId, {
                        substate: Substate.Ready,
                    });
                });
                this.state.updateElement(deviceId, {
                    state: { on: true },
                    substate: Substate.Pending,
                });
                break;
            default:
                logger.error(UNKNOWN_STATE, element.state);
        }

        this.handleUpdate();
    }
}

export default MapService;
