export async function GetOneBookApi(id){
    const book = await fetch('http://localhost:3008/book-render/one/'+ id);
    const bookErrData = !book.ok;
    let booksJson = await book.json();

    if(booksJson.statusCode === 404){
        booksJson.book = null;
        booksJson.chapter = null;
    }

    return {
        book:booksJson.book,
        chapter: booksJson.chapter,
        err:bookErrData
    };
}