import {instance} from "../config/Interceptor";

export const GetAuthorProfilOfCommentService = (id) => {
    return new Promise((resolve, reject) => {
        instance.get('comment/author/'+ id)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const GetCommentService = (type,id, page,limit) => {
    return new Promise((resolve, reject) => {
        instance.get('comment/by/'+ type + '/'+id + '/'+ page + '/' +limit)
            .then((res) => {
                if(res.data.length === 0){
                    console.log('empty data')
                }
                else{
                    console.log(res.data)
                }
                resolve(res.data);
            })
            .catch((err) => reject('err'))
    })
}

export const NewCommentaryService = (target_id,content,type) => {
return new Promise((resolve, reject) => {
    const data = {target_id,content,type};
    instance.post('comment/new',data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
} )
}


export const DeleteCommentaryService = (commentToDeleteId) => {
    console.log(commentToDeleteId)
    return new Promise((resolve, reject) => {
        instance.delete('comment/delete/'+ commentToDeleteId)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    } )
}