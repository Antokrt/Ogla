import {getConfigOfProtectedRoute} from "../utils/Config";

export async function VerifLikeApi(req,type,id){
    const config = await getConfigOfProtectedRoute(req);
    let like;
    let likeErrData;
    let hasLikeJson = false;

    if(config){
        like = await fetch('http://localhost:3008/like/verif/'+type +'/'+ id,config);
        likeErrData = !like.ok;
        hasLikeJson = await like.json();
    }
    return hasLikeJson;
}