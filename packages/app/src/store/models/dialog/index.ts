import { createModel } from "@rematch/core";

import { RootModel } from '../root';

import { DialogShowPayload, DialogSettings, DialogState } from './types';

const INITIAL_STATE: DialogState = {
    active: undefined,
}

export const dialog = createModel<RootModel>()({
    state: INITIAL_STATE,
    reducers: {
        show(state, { content, type, error }: Pick<DialogSettings, 'content' | 'type' | 'error'>): DialogState {
            if (state.active?.open) {
                return state;
            }

            return {
                active: {
                    content,
                    type,
                    error,
                    open: true,
                },
            };
        },
        setClose(state) {
            if (state.active === undefined) {
                return undefined;
            }

            return {
                active: {
                    ...state.active,
                    open: false,
                }
            };
        }
    },
    effects: (dispatch) => ({
        error({ content, error }: DialogShowPayload) {
            dispatch.dialog.show({ content, type: 'error', error });
        },
        crash({ content, error }: DialogShowPayload) {
            dispatch.dialog.show({ content, type: 'crash', error });
        },
        close() {
            dispatch.dialog.setClose();
        }
    }),
});
