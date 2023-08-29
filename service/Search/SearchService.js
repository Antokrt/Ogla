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

export const SearchBookService = (query,page,filter) => {
    return new Promise((resolve, reject) => {
        instance.get('search/books/'+page+'/'+filter,{params:{
                q:query
            }})
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    })
}