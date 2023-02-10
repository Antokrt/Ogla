import {getConfigOfProtectedRoute} from "../utils/Config";

export async function GetPrivateProfilApi(req){
    const config = await getConfigOfProtectedRoute(req);

    const profil = await fetch('http://localhost:3008/user/profil/', config);
    const profilErrData = !profil.ok;
    let profilJson = await profil.json();

    if(profilJson.statusCode){
        profilJson = null;
    }

    return {
        profilJson,
        err:profilErrData
    };
}



export async function GetPublicProfilApi(id){
    const profil = await fetch('http://localhost:3008/user/public-profil/'+ id);
    const profilErrData = !profil.ok;
    let profilJson = await profil.json();

    if(profilJson.statusCode){
        profilJson = null;
    }

    return {
        profilJson,
        err:profilErrData
    };
}