import {instance} from "../config/Interceptor";

export const getBooksByAuthor = (id) => {
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
    return new Promise((resolve, reject) => {
        instance.post('book/delete', data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const updateSummary = (bookId, newSummary) => {
    const data = { bookId, summary:newSummary }
    return new Promise((resolve, reject) => {
        instance.put('author/update-summary', data)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => reject(err));
    })
}

export const updatePicture = (file,bookId) => {
    if(file){
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image',file);
            formData.append('bookId', bookId);

            instance.post('book/book-picture',formData)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        })
    }
    else{
        return null;
    }

}