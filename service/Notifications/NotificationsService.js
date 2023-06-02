import {instance} from "../config/Interceptor";

export const SendNotifService = (targetId, code, targetDocumentId, secondTargetDocumentId) => {
    return new Promise((resolve, reject) => {
        instance.post('notification/new/' + targetId + '/' + code + '/' + targetDocumentId + '/' + secondTargetDocumentId)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const ReadNotifService = (id) => {
    return new Promise((resolve, reject) => {
        instance.put('notification/read/' + id)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const OpenAllService = (date, userId) => {
    return new Promise((resolve, reject) => {
        instance.put('/notification/open/' + date + "/" + userId)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const DeleteAllNotifsService = () => {
    return new Promise((resolve, reject) => {
        instance.delete('notification/deleteAll')
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const ReadAllService = (date) => {
    return new Promise((resolve, reject) => {
        instance.put('/notification/readAll/' + date)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

export const DeleteMyNotifsService = (id) => {
    return new Promise((resolve, reject) => {
        instance.delete('/notification/deleteOne/' + id)
            .then(() => resolve())
            .catch((err) => reject(err));
    })
}

export const GetAllNotifs = () => {
    return new Promise((resolve, reject) => {
        instance.get('/notification')
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}