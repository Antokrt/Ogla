import {instance} from "../config/Interceptor";

export const GetIntentService = () => {
    console.log('kkk')
   return new Promise((resolve, reject) => {
       instance.get('payments/new-intent')
           .then((res) => resolve(res.data))
           .catch((err) => reject(err))
    })
}