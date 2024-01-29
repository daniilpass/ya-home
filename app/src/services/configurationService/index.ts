import {CONFIGURATION_ROOT, CONFIGURATION_FILE_NAME} from './constants';
import {Configuration} from './model/Configuration';

export const loadConfiguration = () => {
    return fetch(`${CONFIGURATION_ROOT}/${CONFIGURATION_FILE_NAME}`)
        .then(response => response.json())
        .then(loadConfigurationElements);
}

const loadConfigurationElements = async (configuration: Configuration) => {
    for (const [id, element] of Object.entries(configuration.elements)) {
        if (typeof(element) === 'string') {
            configuration.elements[id] = await fetch(`${CONFIGURATION_ROOT}/${element}`)
                .then(response => response.json())
                .catch(() => null);
        }
    }
    
    return configuration;
}
