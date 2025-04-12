import type { DeviceLight } from './DeviceLight';
import type { DeviceSwitch } from './DeviceSwitch';
import type { DeviceUnknown } from './DeviceUnknown';
import type { DeviceSensor } from './DeviceSensor';
import type { DeviceSocket } from './DeviceSocket';

export type Device = DeviceSwitch | DeviceLight | DeviceSensor | DeviceUnknown | DeviceSocket;
