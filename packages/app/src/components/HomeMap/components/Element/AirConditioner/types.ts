import type { DeviceIconType, DeviceState, Orientation, Point } from '@homemap/shared';

export type AirConditionerProps = {
    position: Point;
    orientation?: Orientation;
    icon?: DeviceIconType;
    state: DeviceState;
    substate?: string;
    onClick?: () => void;
}
