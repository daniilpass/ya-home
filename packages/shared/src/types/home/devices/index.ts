import { DeviceLight } from './DeviceLight.js';
import { DeviceSwitch } from './DeviceSwitch.js';
import { DeviceUnknown } from './DeviceUnknown.js';

export type Device = DeviceSwitch | DeviceLight | DeviceUnknown;