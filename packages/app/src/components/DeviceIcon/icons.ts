import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SensorsIcon from '@mui/icons-material/Sensors';

export enum DeviceIconName {
    Ligth = 'bulb',
    Temperature = 'temperature',
    Humidity = 'humidity',
    UnknownSensor = 'unknownSensor'
};

export const icons = {
    [DeviceIconName.Ligth]: LightbulbIcon,
    [DeviceIconName.Temperature]: ThermostatIcon,
    [DeviceIconName.Humidity]: WaterDropIcon,
    [DeviceIconName.UnknownSensor]: SensorsIcon,
}