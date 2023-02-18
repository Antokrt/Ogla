import {instance} from "../config/Interceptor";

export const SearchBarService = (query) => {
    return new Promise((resolve, reject) => {
        instance.get('search/search-bar',{params:{
            q:query
            }})
            .then((res) => {
                if(res.data.authors.length === 0 && res.data.books.length === 0){
                    resolve(null);
                }
               resolve(res.data)
            })
            .catch((err) => reject(err));
    })
}

export const SearchBookService = (query,page) => {
    return new Promise((resolve, reject) => {
        instance.get('search/books/1/'+page,{params:{
                q:query
            }})
            .then((res) => {
                if(res.data.length === 0 ){
                    resolve(null);
                }
                resolve(res.data)
            })
            .catch((err) => reject(err));
    })
}