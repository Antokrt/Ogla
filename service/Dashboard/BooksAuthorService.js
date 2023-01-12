import {instance} from "../config/Interceptor";

export const getBooksByAuthor = (id) => {
    return new Promise((resolve, reject) => {
        instance.get('author/book/'+ id)
            .then((res) => {
                console.log()
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

export const getOneBook = (id) => {
return new Promise((resolve, reject) => {
    instance.get('author/book/'+ id)
        .then((res) => {
resolve(res);
        })
        .catch((err) => {
            reject(err);
        })
})
}
