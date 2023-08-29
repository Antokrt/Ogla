import axios from "axios"
import {getSession} from "next-auth/react";

const GetFetchPath = () => {
    if (process.env.NODE_ENV === "development") {
        return 'http://localhost:3008/';
    } else if (process.env.NODE_ENV === "production") {
        return 'https://ogla-api-4fca21bb1e56.herokuapp.com/';
    }
}

export const instance = axios.create({
    baseURL:GetFetchPath(),
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

