export const GetAuthorProfilAPI = async (pseudo) => {
    const data = await fetch('http://localhost:3008/author/public-profil/' + pseudo);
    const bookData = await fetch('http://localhost:3008/book-render/by-author/' + pseudo + '/popular/popular');

    const errDataProfil = !data.ok;
    const errBookData = !bookData.ok;
    let dataJson = await data.json();
    let bookJson = await bookData.json();

    if (dataJson.statusCode === 404) {
        dataJson = null;
    }

    if (bookJson.statusCode === 404) {
        bookJson = null;
    }

    return {
        profil: dataJson,
        books: bookJson,
        errProfil: errDataProfil,
        errBook:errBookData
    };
}
