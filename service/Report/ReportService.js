import {instance} from "../config/Interceptor";

export const NewReportService = (targetId,type) => {
    return new Promise((resolve, reject) => {
        instance.post('report',{targetId,type,reportCode:process.env.NEXT_PUBLIC_REPORT_CODE})
            .then(() => resolve())
            .catch((err) => {
                reject();
            });
    })
}