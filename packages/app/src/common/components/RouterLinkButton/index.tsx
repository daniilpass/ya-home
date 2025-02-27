import { Button, ButtonProps } from '@mui/material';
import styled from '@emotion/styled';
import { Link, LinkProps } from 'react-router-dom';

type RouterLinkButtonProps = Omit<LinkProps, 'LinkComponent'> & ButtonProps;

const StyledButton = styled(Button)<RouterLinkButtonProps>({});

const RouterLinkButton = (props: RouterLinkButtonProps) => (
    <StyledButton LinkComponent={Link} {...props}>
        {props.children}
    </StyledButton>
);

export default RouterLinkButton;