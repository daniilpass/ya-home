import { MenuItem as MuiMenuItem, MenuItemProps as MuiMenuItemProps } from '@mui/material';

import LoadingButton from '../../../../../../common/components/LoadingButton';

import './MenuItem.css';

export type MenuItemProps = {
    icon: JSX.Element;
    isLoading?: boolean;
    children: React.ReactNode;
} & MuiMenuItemProps

export const MenuItem = ({
    icon,
    children,
    isLoading,
    ...other
}: MenuItemProps) => {
    return (
        <MuiMenuItem className='menu-item' {...other}>
            <LoadingButton
                component="label"
                startIcon={icon}
                isLoading={isLoading}
            >
                { children } 
            </LoadingButton>
        </MuiMenuItem>
    )
}