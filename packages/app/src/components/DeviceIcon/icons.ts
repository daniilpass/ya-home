import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SensorsIcon from '@mui/icons-material/Sensors';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PowerIcon from '@mui/icons-material/Power';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import TvIcon from '@mui/icons-material/Tv';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import LightIcon from '@mui/icons-material/Light';
import WbIridescentIcon from '@mui/icons-material/WbIridescent';
import WindPowerIcon from '@mui/icons-material/WindPower';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';

import { deviceIcons, DeviceIconType } from '@homemap/shared';

type IconsType = {
    [key in DeviceIconType]: any;
};

export const Icons: IconsType = {
    [deviceIcons.Light]: LightbulbIcon,
    [deviceIcons.Temperature]: ThermostatIcon,
    [deviceIcons.Humidity]: WaterDropIcon,
    [deviceIcons.Sensor]: SensorsIcon,
    [deviceIcons.Motion]: DirectionsRunIcon,
    [deviceIcons.Socket]: PowerIcon,
    [deviceIcons.Unknown]: QuestionMarkIcon,
    [deviceIcons.Blank]: CheckBoxOutlineBlankIcon,
    [deviceIcons.TV]: TvIcon,
    [deviceIcons.Projector]: WebAssetIcon,
    [deviceIcons.Chandelier]: LightIcon,
    [deviceIcons.LED]: WbIridescentIcon,
    [deviceIcons.Cord]: ElectricalServicesIcon,
    [deviceIcons.Fan]: WindPowerIcon,
};