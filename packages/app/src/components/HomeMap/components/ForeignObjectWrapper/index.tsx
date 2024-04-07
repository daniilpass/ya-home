import { forwardRef, useLayoutEffect, useRef, useState } from 'react';

export type ForeignObjectWrapperProps = React.SVGProps<SVGForeignObjectElement>;

export const ForeignObjectWrapper = forwardRef<SVGForeignObjectElement, ForeignObjectWrapperProps>(
    ({ children, ...props }, foreignObjectRef ) => {
        const [size, setSize] = useState<{ width: number; height: number; }>({ width: 1, height: 1});
        const ref = useRef<HTMLDivElement>(null);

        useLayoutEffect(() => {
            if (ref.current) {
                setSize({
                    width: ref.current.scrollWidth,
                    height: ref.current.scrollHeight,
                })
            }
        }, [ref.current?.scrollWidth, ref.current?.scrollHeight]);

        return (
            <foreignObject
                {...props}
                style={{
                    ...props.style,
                    width: size.width,
                    height: size.height,
                    overflow: 'visible',
                }}
                ref={foreignObjectRef}
            >
                <div ref={ref}>{children}</div>
            </foreignObject>
        )
    }
);