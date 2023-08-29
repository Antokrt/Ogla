import {instance} from "../config/Interceptor";

export const UpdateSettingsService = (newSettings) => {
    return new Promise((resolve, reject) => {
        instance.put('user/settings', newSettings)
            .then((res) => resolve(res.data) )
            .catch(() => reject('err'))
    })
}