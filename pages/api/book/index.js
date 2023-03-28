export async function GetOneBookApi(id) {
    const book = await fetch('http://localhost:3008/book-render/one/' + id + '/order/' + 1);
    const bookErrData = !book.ok;
    let booksJson = await book.json();

    if (booksJson.statusCode === 404) {
        booksJson.book = null;
        booksJson.chapter = null;
    }

    return {
        book: booksJson.book,
        chapter: booksJson.chapter,
        author:booksJson.author,
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
    const bookErrData = !bookList.ok;
    let booksListJson = await bookList.json();

    if (booksListJson.statusCode === 404) {
        booksListJson = null;
    }

    return {
        book: booksListJson,
        err: bookErrData
    };
}