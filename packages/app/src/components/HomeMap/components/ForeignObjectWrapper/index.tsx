import { Size } from '@homemap/shared';

import { useLayoutEffect, useRef, useState } from 'react';
import useResizeObserver from "use-resize-observer";

export type ForeignObjectWrapperProps = React.SVGProps<SVGForeignObjectElement> & {
    onFit?: (rect: Size) => void;
};

export const ForeignObjectWrapper = ({ onFit, children, ...props }: ForeignObjectWrapperProps) => {
    const [size, setSize] = useState<Size>({ width: 1, height: 1});
    const childRef = useRef<HTMLDivElement>(null);
    const { width, height} = useResizeObserver<HTMLDivElement>({ ref: childRef });

    useLayoutEffect(() => {
        if (!childRef.current) {
            return;
        }

        const newSize = {
            width: childRef.current.scrollWidth,
            height: childRef.current.scrollHeight,
        };

        setSize(newSize);
        onFit?.(newSize);
    }, [width, height, onFit]);

    return (
        <foreignObject
            {...props}
            style={{
                ...props.style,
                width: size.width,
                height: size.height,
                overflow: 'visible',
            }}
        >
            <div ref={childRef}>{children}</div>
        </foreignObject>
    )
}