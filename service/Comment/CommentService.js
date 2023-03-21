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

export const GetCommentService = (type,id, page,limit, isConnected,filter ) => {
    return new Promise((resolve, reject) => {
        instance.get('comment/by/'+ type + '/'+id + '/'+ page + '/' +limit + '/'+filter)
            .then((res) => {
                    return Promise.all(res.data.map(async (comment) => {
                        if(isConnected){
                            comment.hasLike = await VerifLikeService('comment', comment._id);
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
                    if(answers.data.length === 0){
                        comment.seeMoreAnswers = false;
                    }
                    else{
                        comment.seeMoreAnswers = true;
                    }
                    return comment;
                }));
            })
            .then((comments) => {
                resolve(comments);
            })
            .catch((err) => {reject(err); console.log(err)});
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

export const GetMyCommentsService = (type,targetId,page,filter) => {
    return new Promise((resolve, reject) => {
        instance.get('comment/my-comments/'+ type +'/'+ targetId+ '/'+ page + '/'+ filter)
            .then((res) => {
                return Promise.all(res.data.map(async (comment) => {
                    comment.hasLike = await VerifLikeService('comment', comment._id);
                    comment.answersPage = 1;
                    return comment;
                }));
            })
            .then((comments) => {
                return Promise.all(comments.map(async (comment) => {
                    const answers = await GetAnswerByCommentService(comment._id,comment.answersPage,1, true);
                    comment.answers = answers.data;
                    if(answers.data.length !== 0){
                        comment.answersPage = 2
                    }
                    if(answers.data.length === 0){
                        comment.seeMoreAnswers = false;
                    }
                    else{
                        comment.seeMoreAnswers = true;
                    }
                    return comment;
                }));
            })
            .then((comments) => {
                resolve(comments);
            })
            .catch((err) => reject(err));
    })
}