import { MAX_PLAN_SIDE_PX } from '../../../constants';

import { default as planSchemaRaw } from './plan.json' assert { type: 'json' };

export const planSchema = {
    ...planSchemaRaw,
    properties: {
        ...planSchemaRaw.properties,
        width: {
            ...planSchemaRaw.properties.width,
            maximum: MAX_PLAN_SIDE_PX,
        },
        height: {
            ...planSchemaRaw.properties.height,
            maximum: MAX_PLAN_SIDE_PX,
        }
    }
}
