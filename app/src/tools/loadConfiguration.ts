const CONFIGURATION_ROOT = './configuration';
const CONFIGURATION_FILE_NAME = 'configuration.json';

interface Configuration {
    apiHost: string;
    apiPollInterval: number;
    apiSyncTimeout: number;
    mapSrc: string;
    elements: Record<string, Element>
}

interface Element {
    title: string;
    entityId: string;
    entity: string;
    type: string;
    icon?: string;
    position: Position;
    area?: Area;
}

interface Position {
    x: number;
    y: number;
}

interface Area {
    bulbsLinePoints?: Point[];
    shadowPoints?: Point[];
    shadowMaskPoints?: Point[];
}

type Point = [number, number];

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
        const iconSrc = element.icon;
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
