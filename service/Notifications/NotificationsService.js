import {instance} from "../config/Interceptor";

export const sendNotif = (id, code, BookId) => {
    return new Promise((resolve, reject) => {
        instance.post('notification/new/' + id + '/' + code + '/' + BookId)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const ReadNotif = (id) => {
    return new Promise((resolve, reject) => {
        instance.put('notification/read/' + id)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const openAll = (date, userId) => {
    return new Promise((resolve, reject) => {
        instance.put('/notification/open/' + date + "/" + userId)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const DeleteAllNotifs = () => {
    return new Promise((resolve, reject) => {
        instance.delete('notification/deleteAll')
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const readAll = (date) => {
    return new Promise((resolve, reject) => {
        instance.put('/notification/readAll/' + date)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const deleteMyNotif = (id) => {
    return new Promise((resolve, reject) => {
        instance.delete('/notification/deleteOne/' + id)
            .then(() => resolve())
            .catch((err) => reject(err));
    })
}