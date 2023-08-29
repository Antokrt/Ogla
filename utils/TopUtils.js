export const GetTopUtils = (data) => {
    if (data.length === 0) {
        return null;
    }

    if(!data){
        return null;
    }

    const objWithMaxLikes = data.reduce((prevObj, currObj) => {
        if (currObj.likes > prevObj.likes) {
            return currObj;
        } else {
            return prevObj;
        }
    });

    return objWithMaxLikes._id;
};