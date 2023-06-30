import {VerifLikeApi} from "../like";
import {GetFetchPath} from "../utils/Instance";

export const GetAuthorProfilAPI = async (pseudo,req) => {
    const data = await fetch(GetFetchPath() + 'author/public-profil/' + pseudo);
    const bookData = await fetch(GetFetchPath() + 'book-render/by-author/' + pseudo + '/popular/popular');

    const errDataProfil = !data.ok;
    const errBookData = !bookData.ok;
    let dataJson = await data.json();
    let bookJson = await bookData.json();
    let hasLikeJson;
    if(req && dataJson){
        hasLikeJson = await VerifLikeApi(req, 'author', dataJson._id);
    }

    if (dataJson.statusCode === 404) {
        dataJson = null;
    }

    if (bookJson.statusCode === 404) {
        bookJson = null;
    }

    return {
        profil: dataJson,
        books: bookJson,
        hasLike:hasLikeJson,
        errProfil: errDataProfil,
        errBook:errBookData
    };
}
