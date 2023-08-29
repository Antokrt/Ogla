import {getConfigOfProtectedRoute} from "../utils/Config";
import {GetFetchPath} from "../utils/Instance";

export async function VerifLikeApi(req,type,id){
    const config = await getConfigOfProtectedRoute(req);
    let like;
    let likeErrData;
    let hasLikeJson = false;

    if(config){
        like = await fetch(GetFetchPath() + 'like/verif/'+type +'/'+ id,config);
        likeErrData = !like.ok;
        hasLikeJson = await like.json();
    }
    return hasLikeJson;
}