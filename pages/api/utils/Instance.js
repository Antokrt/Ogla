export const GetFetchPath = () => {
    if (process.env.NODE_ENV === "development") {
        return 'http://localhost:3008/';
    } else if (process.env.NODE_ENV === "production") {
        return 'https://ogla-api-4fca21bb1e56.herokuapp.com/';
    }
}