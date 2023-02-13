import {instance} from "../config/Interceptor";

export const SendResetPasswordEmailService = (email) => {
    const data = {email}
    return new Promise((resolve, reject)=> {
        instance.post('email/send-email-reset-password',data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const SendNewPasswordWhenForgot = (data) => {

    if(data.token && data.email && data.newPassword && data.userId){
        return new Promise((resolve, reject)=> {
            instance.put('user/change-password-forgot',data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        })
    }
    else{
      return null;
    }

}
