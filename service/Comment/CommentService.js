import {instance} from "../config/Interceptor";

export const GetAuthorProfilOfCommentService = (id) => {
    return new Promise((resolve, reject) => {
        instance.get('comment/author/'+ id)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const GetCommentService = (type,id) => {
    return new Promise((resolve, reject) => {
        instance.get('comment/by/'+ type + '/'+id)
            .then((res) => {
                for(let i = 0 ; i < res.data.length; i++){
                    GetAuthorProfilOfCommentService(res.data[i].userId)
                        .then((profil) => {
                            res.data[i].pseudo = profil.data.pseudo;
                            res.data[i].img = profil.data.img
                        })
                        .catch((err) => {
                            res.data[i].pseudo = 'Inconnu'
                            res.data[i].img = '/'
                        })
                }
                return res
            })
            .then((res) => resolve(res.data))
            .catch((err) => reject('err'))
    })
}

export const NewCommentaryService = (target_id,content,type) => {
return new Promise((resolve, reject) => {
    const data = {target_id,content,type};
    instance.post('comment/new',data)
        .then((res) => {
            GetAuthorProfilOfCommentService(res.data.userId)
                .then((profil) => {
                    res.data.pseudo = profil.data.pseudo;
                    res.data.img = profil.data.img;
                    resolve(res.data);
                })
                .catch((err) => reject(err))
        })
        .catch((err) => reject(err))
} )
}