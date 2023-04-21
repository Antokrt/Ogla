import {instance} from "../config/Interceptor";

export const CreateNotificationService = (targetId,code,targetDocumentId) => {
    return new Promise((resolve, reject) => {
        instance.post('notification/new/' + targetId + '/'+ code + '/' + targetDocumentId)
            .then((res) => resolve())
            .catch(() => reject());
    })
}