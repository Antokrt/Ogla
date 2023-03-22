export async function GetOneBookApi(id){
    const book = await fetch('http://localhost:3008/book-render/one/'+id+ '/order/'+ 1);
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

export async function AddViewToChapterApi(id){
    const addView = await fetch('http://localhost:3008/chapter/view/'+ id,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return await addView.json();

}