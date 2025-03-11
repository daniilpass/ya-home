import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SensorsIcon from '@mui/icons-material/Sensors';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PowerIcon from '@mui/icons-material/Power';

export enum DeviceIconName {
    Ligth = 'bulb',
    Temperature = 'temperature',
    Humidity = 'humidity',
    Sensor = 'sensor',
    Motion = 'motion',
    Socket = 'socket',
    Unknown = 'unknown',
};

export const Icons = {
    [DeviceIconName.Ligth]: LightbulbIcon,
    [DeviceIconName.Temperature]: ThermostatIcon,
    [DeviceIconName.Humidity]: WaterDropIcon,
    [DeviceIconName.Sensor]: SensorsIcon,
    [DeviceIconName.Motion]: DirectionsRunIcon,
    [DeviceIconName.Socket]: PowerIcon,
    [DeviceIconName.Unknown]: HelpOutlineIcon,
}