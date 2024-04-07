import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

export enum DeviceIconName {
    Ligth = 'bulb',
    Temperature = 'temperature',
    Humidity = 'humidity',
};

export const icons = {
    [DeviceIconName.Ligth]: LightbulbIcon,
    [DeviceIconName.Temperature]: ThermostatIcon,
    [DeviceIconName.Humidity]: WaterDropIcon,
}