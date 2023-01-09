import {instance} from "../config/Interceptor";

export const getBooksByAuthor = async () => {
    try {
        const response = await instance.get('author/my-books');
        console.log(response);
    }
    catch (e) {
        return e;
    }
}

