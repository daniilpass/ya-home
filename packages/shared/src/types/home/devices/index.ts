import { DeviceLight } from './DeviceLight';
import { DeviceSwitch } from './DeviceSwitch';
import { DeviceUnknown } from './DeviceUnknown';

export type Device = DeviceSwitch | DeviceLight | DeviceUnknown;