import {instance} from "../config/Interceptor";
import {VerifLikeService} from "../Like/LikeService";

export const GetAnswerByCommentService = async (id, page, limit, isConnected) => {
    const res = await instance.get(`/answer/by/${id}/${page}/${limit}`);

    const updatedData = await Promise.all(res.data.map(async (answer) => {
        if (isConnected) {
            const hasLike = await VerifLikeService('answer', answer._id);
            answer.hasLike = hasLike;
        }
        return answer;
    }));

    res.data = updatedData;
    return res;
};


export const NewAnswerService = (target,content,isConnected) => {
    if(isConnected){
        const data = { target_id:target,content }
        return new Promise((resolve, reject)=> {
            instance.post('/answer/', data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        })
    }
}


export const DeleteAnswerService = (id,isConnected) => {
    if(isConnected){
        return new Promise((resolve, reject)=> {
            instance.delete('/answer/'+id)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        })
    }
}