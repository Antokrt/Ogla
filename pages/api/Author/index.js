export const GetAuthorProfilAPI = async (pseudo) => {
    const data = await fetch('http://localhost:3008/author/public-profil/'+pseudo);
    const errData = !data.ok;
    let dataJson = await data.json();

    if(dataJson.statusCode === 404){
        dataJson = null;
    }

    return {
        profil:dataJson,
        err:errData
    };
}