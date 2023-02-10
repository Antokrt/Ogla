import {instance} from "../config/Interceptor";

export const DeleteAccountService = (email, password) => {
    const data = {email,password};
    return new Promise((resolve, reject) => {
        instance.post('user/delete-account', data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}