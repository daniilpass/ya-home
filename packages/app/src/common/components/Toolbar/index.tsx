import type { ReactNode } from 'react';
import cx from 'classnames';

import './style.css';

type Props = {
    className?: string;
    position: 'top' | 'right' | 'left' | 'bottom',
    withBorder?: boolean,
    children: ReactNode,
}

const Toolbar = ({ className, position, withBorder, children }: Props) => {
    const rootClassName = cx('toolbar', {
        'toolbar--top': position === 'top',
        'toolbar--right': position === 'right',
        'toolbar--left': position === 'left',
        'toolbar--bottom': position === 'bottom',
        'toolbar--border': withBorder,
    }, className);

    return (
        <div className={rootClassName}>
            {children}
        </div>
    );
}

export default Toolbar;