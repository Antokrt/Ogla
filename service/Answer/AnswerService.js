import {instance} from "../config/Interceptor";

export const GetAnswerByComment = (id) => {
    return new Promise((resolve, reject)=> {
        instance.get('/answer/'+ id)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}