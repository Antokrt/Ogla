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

export const newBook = (data, file) => {

    return new Promise((resolve, reject) => {
        instance.post('book/new', data)
            .then((res) => {
                console.log(file)
                if(file){
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('bookId',res.data._id);
                    instance.post('book/book-picture',formData)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err))
                }
                else{
                    resolve(res);
                }

            })
            .catch((err) => reject(err))
    })
}


export const deleteBook = (id) => {
    const data = {
        bookId: id
    }
    console.log(data)
    return new Promise((resolve, reject) => {
        instance.post('book/delete', data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}