import {logger} from '../../tools';
import ApiClient from "../../api";

import MapState from "./mapState";
import {DEFAULT_POLL_INTERVAL, DEFAULT_SYNC_TIMEOUT, UNKNOWN_STATE} from "./constants";
import {Element} from './model/Element';
import {Substate} from './model/Substate';
import {State} from './model/State';

class MapService {
    api: ApiClient;
    state: MapState;
    pollInterval: number;
    pollIntervalId?: number;
    onUpdate?: (elements: Record<string, Element>) => void;

    constructor(
        apiHost: string,
        pollInterval: number = DEFAULT_POLL_INTERVAL,
        syncTimeout: number = DEFAULT_SYNC_TIMEOUT,
        elements = {},
    ) {
        this.api = new ApiClient(apiHost);
        this.pollInterval = pollInterval;
        this.state = new MapState(elements, syncTimeout);
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
        await this.api.getHomeState().then((data) => {
            this.state.updateElements(data);
        });
    }

    switchLight(elementId: string) {
        const element = this.state.elements[elementId];

        if (!element || element.substate !== Substate.Synced) {
            return;
        }

        switch (element.state) {
            case State.On:
                this.api.lightTurnOff(elementId).then(() => {
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
                this.api.lightTurnOn(elementId).then(() => {
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
