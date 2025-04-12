import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';

type RouterLinkButtonProps = Omit<LinkProps, 'LinkComponent'> & ButtonProps;

const StyledButton = styled(Button)<RouterLinkButtonProps>({});

const RouterLinkButton = (props: RouterLinkButtonProps) => (
    <StyledButton LinkComponent={Link} {...props}>
        {props.children}
    </StyledButton>
);

export default RouterLinkButton;