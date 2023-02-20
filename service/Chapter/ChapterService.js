import {instance} from "../config/Interceptor";

export const GetChapterListService = (id,filter,page) => {
    console.log({page,filter})
    return new Promise((resolve, reject) => {
        instance.get('chapter-render/one/'+ id +'/'+ filter + '/'+ page)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    })

}