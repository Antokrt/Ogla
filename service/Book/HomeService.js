import {instance} from "../config/Interceptor";

export const getAllBooks = (token) => {
    return new Promise((resolve, reject) => {
        instance.get('book')
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}