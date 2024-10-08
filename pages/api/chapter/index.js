import {GetFetchPath} from "../utils/Instance";

export async function GetOneChapterApi(id){
    const chapter = await fetch(GetFetchPath() + 'chapter-render/one/'+ id);
    const chapterErrData = !chapter.ok;
    let chapterJson = await chapter.json();

    if(chapterErrData){
        return {
            chapter: null,
            chapterList: null,
            author: null,
            book: null,
            err:chapterErrData
        }
    }
    return {
        chapter: chapterJson.chapter,
        chapterList: chapterJson.chapterList,
        author: chapterJson.author,
        book: chapterJson.book,
        err:chapterErrData
    }
}