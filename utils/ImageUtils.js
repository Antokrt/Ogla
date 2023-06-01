import axios from "axios";
import {instance} from "../service/config/Interceptor";

export const GetDefaultUserImg = () => {
    return process.env.NEXT_PUBLIC_BASE_IMG_USER + 'default.png';
}


export const GetDefaultUserImgWhenError = () => {
    return process.env.NEXT_PUBLIC_DEFAULT_USER_IMG;
}

export const GetDefaultBookImgWhenError = () => {
    return process.env.NEXT_PUBLIC_DEFAULT_BOOK_IMG;
}


export const renderPrediction = (img,type) => {
    return new Promise(async (resolve, reject) => {
        if(!img){
            reject(false);
        }
       const data = await sightEngine(img,type);
        if(data.status === 'success'){
            resolve(validSightEngine(data))
        }
        else {
            resolve(true);
        }
    });
};

 const sightEngine = async (image,type) => {
     let apiUser;
     let apiSecret;

     if(type === 'book'){
         apiUser = process.env.NEXT_PUBLIC_SIGHTENGINE_BOOK_API_USER;
         apiSecret = process.env.NEXT_PUBLIC_SIGHTENGINE_BOOK_API_SECRET;
     }
     if(type === 'user'){
         apiUser = process.env.NEXT_PUBLIC_SIGHTENGINE_USER_API_USER;
         apiSecret = process.env.NEXT_PUBLIC_SIGHTENGINE_USER_API_SECRET;
     }

    const sightengine = axios.create({
        baseURL: "https://api.sightengine.com/1.0/",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });


    const formData = new FormData();
    formData.append('media', image);

     try {
         const response = await sightengine.post('check.json', formData, {
             params: {
                 models: 'nudity-2.0,offensive',
                 api_user: apiUser,
                 api_secret: apiSecret
             }
         });
         return response.data;
     } catch (error) {
         return true;
     }
}

const validSightEngine = (analyzeObject) => {
    if (!analyzeObject) return false;

    const nudity = analyzeObject.nudity;
    let nudityCheck = false;
    const offensive = analyzeObject.offensive.prob;
    let offensiveCheck = false;

    if(nudity.none > 0.20){
        nudityCheck = true;
    }

    if(offensive < 0.20){
        offensiveCheck = true;
    }

    return offensiveCheck && nudityCheck
}
