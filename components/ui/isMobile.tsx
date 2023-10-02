import {useEffect, useState} from 'react';

function useMobileScreen() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768); // 768px is usually the breakpoint for mobile screens
        };

        // Initial check
        checkMobile();

        // Add resize event listener
        window.addEventListener('resize', checkMobile);

        // Cleanup resize event listener on component unmount
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

export default useMobileScreen;
