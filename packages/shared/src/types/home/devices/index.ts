import { DeviceLight } from './DeviceLight';
import { DeviceSwitch } from './DeviceSwitch';
import { DeviceUnknown } from './DeviceUnknown';
import { DeviceSensor } from './DeviceSensor';

export type Device = DeviceSwitch | DeviceLight | DeviceSensor | DeviceUnknown;