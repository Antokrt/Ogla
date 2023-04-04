import {instance} from "../config/Interceptor";

export const GetBooksByAuthorService = (pseudo, filter, page) => {
    return new Promise((resolve, reject) => {
        instance.get('book-render/by-author/'+ pseudo + '/'+ filter + '/'+ page)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export const UpdateAuthorDescriptionService = (newUpdate) => {
    return new Promise((resolve, reject) => {
        instance.put('author/update-description',{description:newUpdate})
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    })
}