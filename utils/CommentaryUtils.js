export const LikeCommentReduce = (id,arr) => {
    const newArr = [...arr];
    newArr.map((item) => {
        if(item._id === id){
            if(item.hasLike){
                item.likes = item.likes - 1;
            }
            else {
                item.likes += 1;
            }
            item.hasLike = !item.hasLike;
        }
    })
    return newArr;
}

export const SendAnswerReduce = (prevComments, targetId, data) => {
    return prevComments.map(comment => {
        if (comment._id === targetId) {
            console.log('test')
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
                    nbAnswers:comment.nbAnswers - 1,
                    answersPage: updatedAnswers.length === 0 ? 1 : comment.answersPage - 1
                };
            }
        }
        return comment;
    });
};

export const LikeAnswerReduce = (comments, replyId) => {
    const newArr = [...comments];
    newArr.map((comment) => {
        comment.answers.map((reply) => {
            if(reply._id === replyId){
                if(reply.hasLike){
                    reply.likes = reply.likes - 1;
                }
                else {
                    reply.likes += 1;
                }
                reply.hasLike = !reply.hasLike;
            }
        })
    });
    return newArr;
};



