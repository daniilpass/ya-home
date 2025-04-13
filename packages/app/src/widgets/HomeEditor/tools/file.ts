import { validate } from 'jsonschema';

import type { Plan } from '@homemap/shared';
import { schemas } from '@homemap/shared';

import { imageUrlToDataURL, readFileAsText, saveFile } from '../../../utils/file';

const dataUrlPrefix = 'data:';

export const exportPlan = async (plan: Plan) => {
    const planToExport: Plan = {
        ...plan,
        background: {
            ...plan.background,
        }
    };

    const bgImage = planToExport.background.image;
    if (bgImage && !bgImage.startsWith(dataUrlPrefix)) {
        planToExport.background.image = await imageUrlToDataURL(bgImage);
    }

    saveFile(JSON.stringify(planToExport, null, 2), 'plan.json', 'application/json');
};

export const importPlan = async (file: File): Promise<Plan> => {
    const planJSON = await readFileAsText(file);
    const plan = JSON.parse(planJSON);
    const validationResult = validate(plan, schemas.planSchema);
    if (!validationResult.valid) {
        throw new Error('Неизвестный файл');
    }
    return plan;
};