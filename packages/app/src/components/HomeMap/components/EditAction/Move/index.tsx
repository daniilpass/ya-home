import { useCallback, useEffect, useRef} from 'react';
import { EDIT_ACTION_SIZE } from '../../../constants';
import colors from '../../../../../common/styles/colors.module.scss';
import { useDrag, DragEvent } from '../../../hooks/useDrag';

import './styles.css';

type Props = {
    x: number,
    y: number,
    index: number;
    draggable?: boolean;
    onDrag?: (index: number, event: DragEvent) => void;
    onDragEnd?: (index: number, event: DragEvent) => void;
}

const fillOpacity = 0.8;
const strokeColor = colors.primaryDark;

const EditActionMove = ({ x, y, index, draggable = true, onDrag, onDragEnd }: Props) => {
    const moveRef = useRef<SVGGElement>(null);

    const handleDrag = useCallback((event: DragEvent) => {
        onDrag?.(index, event);
    }, [index, onDrag]);

    const handleDragEnd = useCallback((event: DragEvent) => {
        console.log('HELLO handleDragEnd', index)
        onDragEnd?.(index, event);
    }, [index, onDragEnd]);

    const onDragStart = useDrag({ onDrag: handleDrag, onDragEnd: handleDragEnd });

    const handlePointerDown = useCallback((e: PointerEvent) => {
        e.stopPropagation();
        onDragStart(e);
    }, [onDragStart]);

    useEffect(() => {
        if (!draggable) {
            return;
        }

        const element = moveRef.current;
        element?.addEventListener('pointerdown', handlePointerDown);

        return () => {
            element?.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [draggable, handlePointerDown]);

    return (
        <g 
            ref={moveRef}
            className='edit-action__move'
        >
            <svg
                width={EDIT_ACTION_SIZE}
                height={EDIT_ACTION_SIZE}
                x={x - EDIT_ACTION_SIZE / 2}
                y={y - EDIT_ACTION_SIZE / 2}
                fill="none"
                viewBox="0 0 48 48"
            >
                <g> 
                    <circle cx="24" cy="24" r="24" fill="white" fillOpacity={fillOpacity}></circle>
                    <path d="M20 12L24 16L28 12" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M24 16V4" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M20 36L24 32L28 36" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M24 32V44" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M36 20L32 24L36 28" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M32 24L44 24" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 20L16 24L12 28" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M16 24H4" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                    <circle cx="24" cy="24" r="2" fill={strokeColor}></circle>
                </g>
            </svg>
        </g>
    )
};

export default EditActionMove;