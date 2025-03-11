import { DeviceLight } from './DeviceLight';
import { DeviceSwitch } from './DeviceSwitch';
import { DeviceUnknown } from './DeviceUnknown';
import { DeviceSensor } from './DeviceSensor';
import { DeviceSocket } from './DeviceSocket';

export type Device = DeviceSwitch | DeviceLight | DeviceSensor | DeviceUnknown | DeviceSocket;
