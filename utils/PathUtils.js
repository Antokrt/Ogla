export const GetUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return 'http://localhost:3000/';
    } else {
        return 'https://ogla-main.vercel.app/';
    }
}