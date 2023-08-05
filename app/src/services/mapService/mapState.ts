import {logger} from '../../tools';
import {mergeDeep} from '../../tools';

import {Element} from './model/Element';
import {Substate} from './model/Substate';
import {SYNC_TYMEOUT, STATE_SYNCED} from './constants';


class MapState {
    elements: Record<string, Element>;
    syncTimeout: number;

    constructor(elements: Record<string, Element>, syncTimeout: number) {
        this.elements = elements;
        this.syncTimeout = syncTimeout;
    }

    updateElements(elementsUpdate: Record<string, Element>) {
        Object.entries(this.elements).forEach(([id, element]) => {
            const elementUpdate = elementsUpdate[id];
            
            if (!elementUpdate) {
                this.updateElement(id, {
                    substate: Substate.Lost,
                });
                return;
            }

            const syncTimeElpased = Date.now() - (element.updatedAt || 0);

            if (element.substate !== Substate.Synced &&
                element.state !== elementUpdate.state &&
                syncTimeElpased < this.syncTimeout
            ) {
                return;
            }

            if (element.state !== elementUpdate.state && syncTimeElpased >= this.syncTimeout) {
                logger.warn(SYNC_TYMEOUT, id)
            }

            if (element.substate !== Substate.Synced &&
                element.state === elementUpdate.state
            ) {
                logger.debug(STATE_SYNCED, elementUpdate.state, id, `${syncTimeElpased} ms`);
            }

            this.updateElement(id, {
                state: elementUpdate.state,
                substate: Substate.Synced,
            });
        });
    }

    updateElement(id: string, options: Pick<Element, 'state' | 'substate'>) {
        const element = this.elements[id];
        if (!element) {
            return;
        }

        Object.assign(element, {
            ...options,
            updatedAt: Date.now(),
        });

        this.applyConditionalProps(element);
    }

    applyConditionalProps(element: Element) {
        const condition = element.condition?.[element.state || ''];
        if (condition) {
            mergeDeep(element, condition);
        }
    }
}

export default MapState;