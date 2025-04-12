import type { Size } from '@homemap/shared';

import React, { useLayoutEffect, useRef, useState } from 'react';
import useResizeObserver from 'use-resize-observer';

export type ForeignObjectWrapperProps = React.SVGProps<SVGForeignObjectElement> & {
    rootClassName?: string;
    rootStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    onFit?: (rect: Size) => void;
};

export const ForeignObjectWrapper = ({
    children,
    rootClassName,
    rootStyle,
    style,
    onFit,
    ...props
}: ForeignObjectWrapperProps) => {
    const [size, setSize] = useState<Size>({ width: 1, height: 1});
    const childRef = useRef<HTMLDivElement>(null);
    const { width, height} = useResizeObserver<HTMLDivElement>({ ref: childRef });

    useLayoutEffect(() => {
        if (!childRef.current) {
            return;
        }

        const newSize = {
            width: childRef.current.offsetWidth,
            height: childRef.current.offsetHeight,
        };

        setSize(newSize);
        onFit?.(newSize);
    }, [width, height, onFit]);

    return (
        <foreignObject
            {...props}
            style={{
                ...style,
                width: size.width,
                height: size.height,
                overflow: 'visible',
            }}
        >
            <div
                ref={childRef}
                className={rootClassName}
                style={rootStyle}
            >
                {children}
            </div>
        </foreignObject>
    )
}