import {VerifLikeApi} from "../like";
import {GetFetchPath} from "../utils/Instance";

export async function GetOneBookApi(id,req) {
    const book = await fetch(GetFetchPath() + 'book-render/one/' + id + '/order/' + 1);
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

export async function GetBookByCategoryApi(category, filter, needTop) {
    const bookList = await fetch(GetFetchPath() + 'book-render/by-cat/' + category + '/' + filter + '/1');
    let topBook;
    let topErrData;
    let topBookJson;
    if(needTop){
         topBook = await fetch(GetFetchPath() + 'book-render/popular-month/');
         topErrData = !topBook.ok;
         topBookJson = await topBook.json();

        if(topBookJson.statusCode === 404){
            topBookJson = null;
        }
    }
    const bookErrData = !bookList.ok;
    let booksListJson = await bookList.json();

    if (booksListJson.statusCode === 404) {
        booksListJson = null;
    }




    return {
        book: booksListJson,
        top: topBookJson ? topBookJson : false,
        err: bookErrData
    };
}

export async function GetTopBooksOnHomeApi(cat1, cat2) {
    const booksData = await fetch(GetFetchPath() + 'book-render/popular-home/' + cat1 + '/' + cat2)
    const booksErrData = !booksData.ok;
    let booksDataJson = await booksData.json();

    if (booksDataJson.statusCode === 404) {
        booksDataJson = null;
    }

    if(booksErrData){
        return {
            tops: null,
            firstTop:null,
            secondTop:null,
            err:true
        }
    }

    return {
        tops: booksDataJson.topTwoBooks,
        firstTop: booksDataJson.topBooksCat1,
        secondTop: booksDataJson.topBooksCat2,
        err: booksErrData
    }
}