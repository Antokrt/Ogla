import {instance} from "../config/Interceptor";

export const AddToProgressService = (bookId,chapterId) => {
    return new Promise((resolve, reject) => {
        instance.post('progress/new-chapter-progress',{bookId,chapterId})
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}


export const GetProgressService = () => {
    return new Promise((resolve, reject) => {
        instance.get('progress')
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}