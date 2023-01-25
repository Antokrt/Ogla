import {instance} from "../config/Interceptor";

export const LikeBookService = (id) => {
    return new Promise((resolve, reject) => {
        instance.post('like/book/', {id})
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const LikeChapterService = (id) => {
    return new Promise((resolve, reject) => {
        instance.post('like/chapter',{id})
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}