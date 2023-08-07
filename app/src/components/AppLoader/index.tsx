import {FC} from 'react';
import cx from 'classnames';

import Loader from '../Loader';

import './style.css';

type Props = {
    isLoading: boolean;
}

const AppLoader: FC<Props> = ({isLoading}) => {
    const className = cx('app-loader', {
        'app-loader--loaded': !isLoading,
    });

    return (
        <div className={className}>
            {isLoading && (
                <Loader />
            )}
        </div>
    )
}

export default AppLoader;
