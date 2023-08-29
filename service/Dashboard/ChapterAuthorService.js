import {instance} from "../config/Interceptor";



export const NewChapterService = (data) => {
    return new Promise((resolve, reject)=> {
        instance.post('chapter/new', data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}


export const SaveChapterService = (data) => {
    return new Promise((resolve, reject)=> {
        instance.put('chapter/'+ data.id, data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const PublishChapterService = (data) => {
    return new Promise((resolve, reject) => {
        instance.put('chapter/publish/'+ data.id, data)
            .then((res) => resolve(res))
            .catch((err) => {
                reject(err);
            });
    })
}

export const DeleteChapterService = (id) => {
    return new Promise((resolve, reject)=> {
        instance.delete('chapter/'+ id)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}