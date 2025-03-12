import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SensorsIcon from '@mui/icons-material/Sensors';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PowerIcon from '@mui/icons-material/Power';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

export enum DeviceIconName {
    Ligth = 'bulb',
    Temperature = 'temperature',
    Humidity = 'humidity',
    Sensor = 'sensor',
    Motion = 'motion',
    Socket = 'socket',
    Unknown = 'unknown',
    Blank = 'blank',
};

export const Icons = {
    [DeviceIconName.Ligth]: LightbulbIcon,
    [DeviceIconName.Temperature]: ThermostatIcon,
    [DeviceIconName.Humidity]: WaterDropIcon,
    [DeviceIconName.Sensor]: SensorsIcon,
    [DeviceIconName.Motion]: DirectionsRunIcon,
    [DeviceIconName.Socket]: PowerIcon,
    [DeviceIconName.Unknown]: QuestionMarkIcon,
    [DeviceIconName.Blank]: CheckBoxOutlineBlankIcon,
}