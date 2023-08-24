import {logger} from '../../tools';
import ApiClient from '../../api';
import {API_POLL_INTERVAL, API_SYNC_TIMEOUT} from '../../constants';

import MapState from "./mapState";
import {UNKNOWN_STATE} from "./constants";
import {Element} from './model/Element';
import {Substate} from './model/Substate';
import {State} from './model/State';


class MapService {
    state: MapState;
    pollInterval: number;
    pollIntervalId?: number;
    onUpdate?: (elements: Record<string, Element>) => void;

    constructor(
        elements: Record<string, Element> = {},
    ) {
        this.pollInterval = API_POLL_INTERVAL;
        this.state = new MapState(elements, API_SYNC_TIMEOUT);
    }

    async start() {
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

    switchLight(elementId: string) {
        const element = this.state.elements[elementId];

        if (!element || element.substate !== Substate.Synced) {
            return;
        }

        switch (element.state) {
            case State.On:
                ApiClient.lightOff(elementId).then(() => {
                    this.state.updateElement(elementId, {
                        substate: Substate.Ready,
                    });
                });
                this.state.updateElement(elementId, {
                    state: State.Off,
                    substate: Substate.Pending,
                });
                break;
            case State.Off:
                ApiClient.lightOn(elementId).then(() => {
                    this.state.updateElement(elementId, {
                        substate: Substate.Ready,
                    });
                });
                this.state.updateElement(elementId, {
                    state: State.On,
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
