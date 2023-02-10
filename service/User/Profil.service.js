import {instance} from "../config/Interceptor";

export const UpdateUserProfilPictureService = (file) => {
    if(file){
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image',file);
            instance.post('user/profil-picture',formData)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        })
    }
    else{
        return null;
    }
}

export const DeleteUserProfilPictureService = () => {
    return new Promise((resolve, reject) => {
        instance.delete('user/profil-picture')
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}