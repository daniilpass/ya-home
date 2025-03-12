import { Box, Divider, } from '@mui/material';

type Props = {
    title: string;
    children?: React.ReactNode;
}

export const PropertiesGroup = ({ title, children }: Props) => (
    <>
        <Divider variant="middle" textAlign="left">{title}</Divider>
        <Box sx={{p: 2}}>
            {children}
        </Box>
    </>
)