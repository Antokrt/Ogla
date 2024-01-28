import {instance} from "../config/Interceptor";

export const GetIntentService = (data) => {
   return new Promise((resolve, reject) => {
       instance.post('payments/new-intent',data)
           .then((res) => resolve(res.data))
           .catch((err) => reject(err))
    })
}