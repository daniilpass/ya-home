import { ReactNode } from 'react';
import cx from 'classnames';

import './style.scss';

type Props = {
    position: 'top' | 'right' | 'left',
    withBorder?: boolean,
    children: ReactNode,
}

const Toolbar = ({ position, withBorder, children }: Props) => {
    const className = cx('toolbar', {
        'toolbar--top': position === 'top',
        'toolbar--right': position === 'right',
        'toolbar--left': position === 'left',
        'toolbar--border': withBorder,
    });

    return (
        <div className={className}>
            {children}
        </div>
    );
}

export default Toolbar;