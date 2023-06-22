import { useEffect } from 'react';

const CustomStyle = () => {
    useEffect(() => {
        const elements = document.querySelectorAll('*');
        elements.forEach((element) => {
            const computedStyle = window.getComputedStyle(element);
            const fontFamily = computedStyle.getPropertyValue('font-family');
            if (fontFamily && fontFamily.includes('Open Sans')) {
                element.style.letterSpacing = '-0.3px';
            }
        });
    }, []);

    return null;
};

export default CustomStyle;