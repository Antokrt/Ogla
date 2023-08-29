export const BodyOverflowUtils = (cssValue) => {
    if (typeof window !== 'undefined') {
        const body = document.querySelector('body');
        body.style.overflow = cssValue;
    }
}