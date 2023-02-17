export const SearchBookAPI = async (query) => {
    const data = await fetch('http://localhost:3008/search/books/1/1?q='+query);
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