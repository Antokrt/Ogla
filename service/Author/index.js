import {instance} from "../config/Interceptor";

export const GetBooksByAuthor = (pseudo,filter,page) => {
    console.log(filter)
    return new Promise((resolve, reject) => {
        instance.get('book-render/by-author/'+ pseudo + '/'+ filter + '/'+ page)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}