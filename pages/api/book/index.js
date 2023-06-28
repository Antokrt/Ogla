import {VerifLikeApi} from "../like";

export async function GetOneBookApi(id,req) {
    const book = await fetch('http://localhost:3008/book-render/one/' + id + '/order/' + 1);
    const bookErrData = !book.ok;
    let booksJson = await book.json();
    let hasLikeJson;
    if(req){
         hasLikeJson = await VerifLikeApi(req, 'book', id);
    }



    // console.log(booksJson)

    if (booksJson.statusCode === 404) {
        booksJson.book = null;
        booksJson.chapter = null;
    }

    return {
        book: booksJson.book,
        chapter: booksJson.chapter,
        author: booksJson.author,
        hasLike:hasLikeJson,
        err: bookErrData
    };
}

export async function AddViewToChapterApi(id) {
    const addView = await fetch('http://localhost:3008/chapter/view/' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return await addView.json();

}

export async function GetBookByCategoryApi(category, filter) {
    const bookList = await fetch('http://localhost:3008/book-render/by-cat/' + category + '/' + filter + '/1');
    const topBook = await fetch('http://localhost:3008/book-render/popular-month/');
    const topErrData = !topBook.ok;
    const bookErrData = !bookList.ok;
    let booksListJson = await bookList.json();
    let topBookJson = await topBook.json();

    if (booksListJson.statusCode === 404) {
        booksListJson = null;
    }
    if(topBookJson.statusCode === 404){
        topBookJson = null;
    }

    return {
        book: booksListJson,
        top: topBookJson,
        err: bookErrData
    };
}

export async function GetTopBooksOnHomeApi(cat1, cat2) {
    const booksData = await fetch('https://ogla-api-4fca21bb1e56.herokuapp.com/book-render/popular-home/' + cat1 + '/' + cat2)
    const booksErrData = !booksData.ok;
    let booksDataJson = await booksData.json();

    if (booksDataJson.statusCode === 404) {
        booksDataJson = null;
    }

    return {
        tops: booksDataJson.topTwoBooks,
        firstTop: booksDataJson.topBooksCat1,
        secondTop: booksDataJson.topBooksCat2,
        err: booksErrData
    }
}