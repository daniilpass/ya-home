import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

type Props = {
    bgColor: string;
    textColor: string;
};

const ColorButton = styled(Button)(({ bgColor, textColor }: Props) => ({
    backgroundColor: bgColor,
    color: textColor,
    fontFamily: 'Monospace',
    '&:hover': {
        backgroundColor: bgColor,
    },
    '&:active': {
        backgroundColor: bgColor,
    },
}));

export default ColorButton;