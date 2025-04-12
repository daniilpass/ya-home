import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';

import Loader from '../Loader';

export type LoadingButtonProps = ButtonProps & {
    isLoading?: boolean;
}

const LoadingButton = ({
    isLoading,
    startIcon,
    children,
    ...restProps
}: LoadingButtonProps) => {
    return (
        <Button
            startIcon={isLoading ? <Loader /> : startIcon}
            disabled={isLoading} 
            {...restProps}
        >
            {children}
        </Button>
    );
};

export default LoadingButton;