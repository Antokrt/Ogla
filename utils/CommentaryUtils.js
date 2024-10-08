import {SendNotifService} from "../service/Notifications/NotificationsService";
import {activeLoading, addComment, disableLoading, incrPages} from "../store/slices/commentSlice";
import {GetCommentService} from "../service/Comment/CommentService";

export const GetCommentsUtils =  (commentsReducer, nbComments, activeLoadingF, disableLoadingF, type, activeId, pages, session, activeFilter, lastCommentId, addCommentF,incrPagesF,activeErrF) => {

    if (commentsReducer.length >= nbComments) {
        return null;
    }

    activeLoading();

    GetCommentService(type, activeId, pages, 5, session, activeFilter)
        .then((res) => {
            res.forEach(element => {
                if (!lastCommentId.includes(element._id)) {
                    addCommentF(element);
                }
            });
            if (res.length !== 0) {
                incrPagesF();
                // setCanScroll(true);
            } else {
                // setCanScroll(false);
            }


        })
        .then(() => disableLoadingF())
        .catch(() => activeErrF());
}

export const LikeCommentReduce = (id, arr, authorId, userId, targetDocumentId, secondTargetDocumentId) => {
    const newArr = [...arr];
    newArr.map((item) => {
        if (item._id === id) {
            if (item.hasLike) {
                item.likes = item.likes - 1;
            } else {
                item.likes += 1;
                if (authorId != userId) SendNotifService(item.userId, 4, targetDocumentId, secondTargetDocumentId); else SendNotifService(item.userId, 6, targetDocumentId, secondTargetDocumentId);
            }
            item.hasLike = !item.hasLike;
        }
    })
    return newArr;
}

export const SendAnswerReduce = (prevComments, targetId, data) => {
    return prevComments.map(comment => {
        if (comment._id === targetId) {
            return {
                ...comment,
                answers: comment.answers ? [...comment.answers, data] : [data],
                nbAnswers: comment.nbAnswers + 1,
                answersPage: comment.answersPage === 0 ? 1 : comment.answersPage + 1
            };
        }
        return comment;
    });
};

export const DeleteAnswerReduce = (prevComments, id) => {
    return prevComments.map(comment => {
        if (comment.answers) {
            const updatedAnswers = comment.answers.filter(answer => answer._id !== id);
            if (comment.answers.find(answer => answer._id === id)) {
                return {
                    ...comment,
                    answers: updatedAnswers,
                    nbAnswers: comment.nbAnswers - 1,
                    answersPage: updatedAnswers.length === 0 ? 1 : comment.answersPage - 1
                };
            }
        }
        return comment;
    });
};

export const LikeAnswerReduce = (comments, replyId, authorId, userId, targetDocumentId, secondTargetDocumentId) => {
    const newArr = [...comments];
    newArr.map((comment) => {
        comment.answers.map((reply) => {
            if (reply._id === replyId) {
                if (reply.hasLike) {
                    reply.likes = reply.likes - 1;
                } else {
                    reply.likes += 1;
                    if (authorId != userId) SendNotifService(reply.userId, 5, targetDocumentId, secondTargetDocumentId); else SendNotifService(reply.userId, 7, targetDocumentId, secondTargetDocumentId);
                }
                reply.hasLike = !reply.hasLike;
            }
        })
    });
    return newArr;
};



