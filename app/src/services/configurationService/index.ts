import {CONFIGURATION_ROOT, CONFIGURATION_FILE_NAME} from './constants';
import {Configuration} from './model/Configuration';

export const loadConfiguration = () => {
    return fetch(`${CONFIGURATION_ROOT}/${CONFIGURATION_FILE_NAME}`)
        .then(response => response.json())
        .then(loadConfigurationElements)
        .then(loadConfigurationElementsIcon);
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

const loadConfigurationElementsIcon = async (configuration: Configuration) => {
    const cache: Record<string, string> = {};

    for (const [id, element] of Object.entries(configuration.elements)) {
        const iconSrc = element.iconSrc;
        if (iconSrc) {
            configuration.elements[id].icon = cache[iconSrc] 
                ? cache[iconSrc] 
                : await fetch(iconSrc)
                    .then(response => response.text())
                    .then(data => {
                        cache[iconSrc] = data;
                        return data;
                    })
                    .catch(() => undefined);
        }
    }
    
    return configuration;
}