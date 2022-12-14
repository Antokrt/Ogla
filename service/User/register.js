import axios from "axios";
export const RegisterService = (formData) => {
    console.log('oeroeoe')
    return new Promise((resolve, reject) => {
        if(
            formData.hasOwnProperty('email') &&
            formData.hasOwnProperty('pseudo') &&
            formData.hasOwnProperty('password') &&
            formData.hasOwnProperty('is_author')
        ){
            axios.post('http://localhost:3008/user/register',formData)
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        }
        else reject('Form are not complete')
    })

}