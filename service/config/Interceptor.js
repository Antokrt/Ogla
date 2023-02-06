import axios from "axios"
import {getSession} from "next-auth/react";

export const instance = axios.create({
    baseURL:'http://localhost:3008/'
})

instance.interceptors.request.use(async config => {
   const data = await getSession();
   console.log(data.user.accessToken)
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

