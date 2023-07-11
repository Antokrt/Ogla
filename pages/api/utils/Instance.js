export const GetFetchPath = () => {
    if (process.env.NODE_ENV === "development") {
        return 'http://localhost:3008/';
    } else {
        return 'https://ogla-api-4fca21bb1e56.herokuapp.com/';
    }
}

export const GetApiPath = () => {
    if (process.env.NODE_ENV === "development") {
        return 'http://localhost:3000/';
    } else {
        return 'https://ogla.vercel.app/';
    }
}