export const ReloadSession = () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
}