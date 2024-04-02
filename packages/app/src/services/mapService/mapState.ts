import isEqual from 'lodash.isequal';

import {logger} from '../../common/tools';

import {Element} from './model/Element';
import {Substate} from './model/Substate';
import {SYNC_TYMEOUT, STATE_SYNCED} from './constants';
import { Collection, Device } from '@homemap/shared';

class MapState {
    elements: Record<string, Element>;
    syncTimeout: number;

    constructor(elements: Record<string, Element>, syncTimeout: number) {
        this.elements = elements;
        this.syncTimeout = syncTimeout;
        this.initElementsState();
    }

    initElementsState() {
        Object.entries(this.elements).forEach(([id]) => {
            this.updateElement(id, {
                substate: Substate.Pending,
            });
        });
    }

    updateElements(devices: Collection<Device>) {
        Object.entries(this.elements).forEach(([id, element]) => {
            const elementUpdate = devices[id];
            
            if (!elementUpdate) {
                this.updateElement(id, {
                    substate: Substate.Lost,
                });
                return;
            }

            const syncTimeElpased = Date.now() - (element.updatedAt || 0);

            /**
             * State updated with some time lag, so wait some time before update state
             */
            if (element.substate !== Substate.Synced && // Not synced
                element.state && // Have state (no state - initial call)
                !isEqual(element.state, elementUpdate.state) && // State not equal
                syncTimeElpased < this.syncTimeout // Timeout not expired
            ) {
                return;
            }

            /**
             * Some logging
             */
            if (!isEqual(element.state, elementUpdate.state) && syncTimeElpased >= this.syncTimeout) {
                logger.warn(SYNC_TYMEOUT, id)
            }

            if (element.substate !== Substate.Synced &&
                isEqual(element.state, elementUpdate.state)
            ) {
                logger.debug(STATE_SYNCED, elementUpdate.state, id, `${syncTimeElpased} ms`);
            }

            /**
             * Finally update device state
             */
            this.updateElement(id, {
                state: elementUpdate.state,
                substate: Substate.Synced,
            });
        });
    }

    updateElement(id: string, options: Partial<Pick<Element, 'state' | 'substate'>>): Element | null {
        const element = this.elements[id];
        if (!element) {
            return null;
        }

        if (options.state) {
            element.state = {
                ...(element.state || {}),
                ...options.state,
            }
        }

        if (options.substate) {
            element.substate = options.substate;
        }
        
        element.updatedAt = Date.now();

        return element;
    }
}

export default MapState;