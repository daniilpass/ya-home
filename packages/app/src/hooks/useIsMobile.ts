import { useEffect, useState } from 'react';
import { mobileWidth } from '../constants/layout';

const getIsMobile = () => window.innerWidth <= mobileWidth;

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(getIsMobile());

    useEffect(() => {
        const onResize = () => {
            setIsMobile(getIsMobile());
        };

        window.addEventListener('resize', onResize);
    
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    
    return isMobile;
};