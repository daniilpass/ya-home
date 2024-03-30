import { DeviceTypes } from '../types'

export const deviceTypeToName = (type: DeviceTypes) => {
    switch (type) {
        case DeviceTypes.Light:
            return "Свет";
        case DeviceTypes.Switch:
            return "Выключатель";
        case DeviceTypes.Unknown:
        default:
            return "Неизвестный";
    }
}