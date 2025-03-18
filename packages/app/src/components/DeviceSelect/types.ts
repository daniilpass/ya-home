import { MouseEvent as ReactMouseEvent } from 'react';

import { Device } from '@homemap/shared';

export type onDeviceSelectItemClick = (id: string, event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void

export type DeviceSelectItem = Pick<Device, 'id' | 'name' | 'type' | 'subtype'>