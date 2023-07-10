import {GetFetchPath} from "../utils/Instance";

export async function GetActiveMonthlyCateoryApi() {

    const catData = await fetch(GetFetchPath() + 'category/active-monthly-category');
    const catErrData = !catData.ok;
    let catDataJson = await catData.json();

    if (catDataJson.statusCode === 404) {
        catDataJson = null;
    }

    return {
        data: catDataJson[0],
        err: catErrData
    }
}