import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SensorsIcon from '@mui/icons-material/Sensors';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PowerIcon from '@mui/icons-material/Power';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { deviceIcons, DeviceIconType } from '@homemap/shared';

type IconsType = {
    [key in DeviceIconType]: any;
};

export const Icons: IconsType = {
    [deviceIcons.Ligth]: LightbulbIcon,
    [deviceIcons.Temperature]: ThermostatIcon,
    [deviceIcons.Humidity]: WaterDropIcon,
    [deviceIcons.Sensor]: SensorsIcon,
    [deviceIcons.Motion]: DirectionsRunIcon,
    [deviceIcons.Socket]: PowerIcon,
    [deviceIcons.Unknown]: QuestionMarkIcon,
    [deviceIcons.Blank]: CheckBoxOutlineBlankIcon,
};