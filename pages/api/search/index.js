import {GetFetchPath} from "../utils/Instance";

export const SearchBookAPI = async (query) => {
    const data = await fetch(GetFetchPath() + 'search/books/1/popular/?q='+query);
    const errData = !data.ok;
    let dataJson = await data.json();

    if(dataJson.statusCode === 404){
        dataJson = null;
    }

    return {
        searchData: dataJson,
        err:errData
    }
}