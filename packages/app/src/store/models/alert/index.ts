import { createModel } from '@rematch/core';
import { v4 as uuid4 } from 'uuid';

import type { RootModel } from '../root';

import type { AlertSettings, AlertState } from './types';

const INITIAL_STATE: AlertState = {
    queue: [],
};

const MAX_QUEUE_LENGTH = 3;

export const alerts = createModel<RootModel>()({
    state: INITIAL_STATE,
    reducers: {
        add(state, { content, severity }:Pick<AlertSettings, 'content' | 'severity'>): AlertState {
            const cloneState = {
                queue: [
                    ...state.queue,
                ],
            };

            if (state.queue.length >= MAX_QUEUE_LENGTH) {
                // Find first (oldest) not closed and close
                const itemIndex = state.queue.findIndex(x => x.open === true);
                cloneState.queue[itemIndex] = {
                    ...cloneState.queue[itemIndex],
                    open: false,
                };
            }

            return {
                queue: [
                    ...cloneState.queue,
                    {
                        id: uuid4(),
                        open: true,
                        content,
                        severity,
                    }
                ],
            };
        },
        setClose(state, id: string): AlertState {
            const cloneState = {
                queue: [
                    ...state.queue,
                ],
            };

            const itemIndex = state.queue.findIndex(x => x.id === id);
            cloneState.queue[itemIndex] = {
                ...cloneState.queue[itemIndex],
                open: false,
            };

            return cloneState;
        },
        delete(state, id: string): AlertState {
            const cloneState = {
                queue: state.queue.filter(x => x.id !== id),
            };

            return cloneState;
        }
    },
    effects: (dispatch) => ({
        success(content: string) {
            dispatch.alerts.add({ content, severity: 'success' });
        },
        error(content: string) {
            dispatch.alerts.add({ content, severity: 'error' });
        },
        info(content: string) {
            dispatch.alerts.add({ content, severity: 'info' });
        },
        warning(content: string) {
            dispatch.alerts.add({ content, severity: 'warning' });
        },
        close(id: string) {
            dispatch.alerts.setClose(id);
        },
        exited(id: string) {
            dispatch.alerts.delete(id);
        },
    }),
});
