import axios from "axios"
import {getSession} from "next-auth/react";

export const instance = axios.create({
    baseURL:'http://192.168.0.29:3008/',

})

instance.interceptors.request.use(async config => {
   const data = await getSession();

    if(data){
       const token = data.user.accessToken;
       if(token){
           config.headers.Authorization = `Bearer ${token}`
       }
   }
    else {
        delete config.headers.Authorization;
    }
    return config;
})

