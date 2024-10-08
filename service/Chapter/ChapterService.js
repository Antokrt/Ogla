import {instance} from "../config/Interceptor";

export const GetChapterListService = (id,filter,page) => {
    return new Promise((resolve, reject) => {
        instance.get('chapter-render/one/'+ id +'/'+ filter + '/'+ page)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    })
}

export const GetChapterById = (id) => {
    return new Promise((resolve, reject) => {
        instance.get('/chapter/label/' + id)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    })
}

export const CountNbOfChaptersService = (id) => {
    return new Promise((resolve, reject) => {
        instance.get('/chapter/number-of-chapter/'+ id)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    })
}