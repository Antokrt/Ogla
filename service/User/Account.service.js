import {instance} from "../config/Interceptor";

export const DeleteAccountService = (email, password) => {
    const data = {email,password};
    return new Promise((resolve, reject) => {
        instance.post('user/delete-account', data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const VerifyEmailService = () => {
    return new Promise((resolve, reject) => {
        instance.put('email/new-verification')
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}


export const LogoutService = () => {
    return new Promise((resolve, reject) =>{
        instance.get('auth/logout')
            .then(resolve)
            .catch(reject)
    })
}

