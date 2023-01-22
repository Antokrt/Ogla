import {instance} from "../config/Interceptor";


export const getChapter = (id) => {
    return new Promise((resolve, reject)=> {
        instance.get('chapter/dashboard/list/'+ id)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const newChapter = (data) => {
    return new Promise((resolve, reject)=> {
        instance.post('chapter/new', data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}


export const saveChapter = (data) => {
    return new Promise((resolve, reject)=> {
        instance.put('chapter/'+ data.id, data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const publishChapter = (data) => {
    return new Promise((resolve, reject) => {
        instance.put('chapter/publish/'+ data.id, data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}