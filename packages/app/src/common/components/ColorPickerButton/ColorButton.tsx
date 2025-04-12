import { Button } from '@mui/material';
import styled from '@emotion/styled';

type Props = {
    bgColor: string;
    textColor: string;
};

const makeStyle = ({ bgColor, textColor }: Props) => ({
    backgroundColor: bgColor,
    color: textColor,
    fontFamily: 'Monospace',
    '&:hover': {
        backgroundColor: bgColor,
    },
    '&:active': {
        backgroundColor: bgColor,
    },
});

const ColorButton = styled(
    Button,
    {
        shouldForwardProp: (propName: string) => !['bgColor', 'textColor'].includes(propName),
    }
)(makeStyle);

export default ColorButton;