import {instance} from "../config/Interceptor";
import axios from "axios";

export const getAllBooks = (token) => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3008/book/')
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const GetBooksWithCategoryService = (category,filter,page) => {
    return new Promise((resolve, reject) => {
        instance.get('/book-render/by-cat/'+ category +'/'+filter + '/'+ page)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => reject(err));
    })
}

export const GetRandomBookService = () => {
    return new Promise((resolve, reject) => {
        instance.get('/book-render/random')
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    } )
}

export const GetOneBook = (id) => {
    return new Promise((resolve, reject) => {
        instance.get('/book/' + id)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    })
}