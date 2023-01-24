import {instance} from "../config/Interceptor";

export const VerifLikeService = (id,type) => {
    const data = {id,type};
    return new Promise((resolve, reject) => {
        instance.post('http://localhost:3008/like/verif',data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}