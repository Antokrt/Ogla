import {getConfigOfProtectedRoute} from "../utils/Config";
import {GetFetchPath} from "../utils/Instance";

export async function GetPrivateProfilApi(req){
    const config = await getConfigOfProtectedRoute(req);

    const profil = await fetch(GetFetchPath() + 'user/profil/', config);
    const profilErrData = !profil.ok;
    let profilJson = await profil.json();

    if(profilJson.statusCode === 401){
        profilJson = null;
    }

    return {
        profilJson,
        err:profilErrData
    };
}



export async function GetPublicProfilApi(id){
    const profil = await fetch(GetFetchPath() + 'user/public-profil/'+ id);
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

export async function VerifEmailApi(id){
    const profil = await fetch('/api/auth/session?email-verified');
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