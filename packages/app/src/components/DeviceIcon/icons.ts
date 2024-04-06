import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';

export enum DeviceIconName {
    Ligth = 'bulb',
    Temperature = 'temperature',
};

export const icons = {
    [DeviceIconName.Ligth]: LightbulbIcon,
    [DeviceIconName.Temperature]: ThermostatIcon,
}