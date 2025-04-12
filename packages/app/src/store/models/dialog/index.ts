import { createModel } from '@rematch/core';

import { RootModel } from '../root';

import { DialogSettings, DialogState } from './types';

const INITIAL_STATE: DialogState = {
    active: undefined,
}

export const dialog = createModel<RootModel>()({
    state: INITIAL_STATE,
    reducers: {
        show(state, { content, type }: Pick<DialogSettings, 'content' | 'type'>): DialogState {
            if (state.active?.open) {
                return state;
            }

            return {
                active: {
                    content,
                    type,
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
        error(content: string) {
            dispatch.dialog.show({ content, type: 'error' });
        },
        crash(content: string) {
            dispatch.dialog.show({ content, type: 'crash' });
        },
        close() {
            dispatch.dialog.setClose();
        }
    }),
});
