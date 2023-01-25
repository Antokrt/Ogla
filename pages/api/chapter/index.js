export async function GetOneChapterApi(id){
    const chapter = await fetch('http://localhost:3008/chapter-render/one/'+ id);
    const chapterErrData = !chapter.ok;
    let chapterJson = await chapter.json();

    if(chapterJson.statusCode === 404){
        chapterJson = null;
    }

    return {
        chapter: chapterJson.chapter,
        author: chapterJson.author,
        book: chapterJson.book,
        err:chapterErrData
    }
}