import {instance} from "../config/Interceptor";
import {VerifLikeService} from "../Like/LikeService";
import {GetAnswerByCommentService} from "../Answer/AnswerService";

export const GetAuthorProfilOfCommentService = (id) => {
    return new Promise((resolve, reject) => {
        instance.get('comment/author/'+ id)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const GetCommentService = (type,id, page,limit, isConnected, pageAnswer) => {
    return new Promise((resolve, reject) => {
        instance.get('comment/by/'+ type + '/'+id + '/'+ page + '/' +limit)
            .then((res) => {
                    return Promise.all(res.data.map(async (comment) => {
                        if(isConnected){
                            const hasLike = await VerifLikeService('comment', comment._id);
                            comment.hasLike = hasLike;
                        }
                        comment.answersPage = 1;
                        return comment;
                    }));
            })
            .then((comments) => {
                return Promise.all(comments.map(async (comment) => {
                    const answers = await GetAnswerByCommentService(comment._id,comment.answersPage,1, isConnected);
                    comment.answers = answers.data;
                    if(answers.data.length !== 0){
                        comment.answersPage = 2
                    }
                    return comment;
                }));
            })
            .then((comments) => {
                resolve(comments);
            })
            .catch((err) => reject(err));
    });
};
export const NewCommentaryService = (target_id,content,type) => {
return new Promise((resolve, reject) => {
    const data = {target_id,content,type};
    instance.post('comment/new',data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
} )
}


export const DeleteCommentaryService = (commentToDeleteId) => {
    return new Promise((resolve, reject) => {
        instance.delete('comment/delete/'+ commentToDeleteId)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    } )
}