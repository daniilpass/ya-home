import { DeviceAction, Plan, schemas } from '@homemap/shared';

import { jsonValidator } from '../../utils/jsonValidator';
import { SchemaValidationError } from '../../errors';

const validatePlan = (plan: Plan) => {
    const { valid, errors } = jsonValidator.validate(plan, schemas.planSchema);
    if (!valid) {
        throw new SchemaValidationError(errors);
    }
}

const validateDeviceAction = (action: DeviceAction) => {
    const { valid, errors } = jsonValidator.validate(action, schemas.deviceActionSchema);
    if (!valid) {
        throw new SchemaValidationError(errors);
    }
}

export const ValidationService = {
    validatePlan,
    validateDeviceAction,
}