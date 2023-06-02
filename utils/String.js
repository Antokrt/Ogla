
const Capitalize = (str) => {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
}

const ReduceString = (str,limit) => {
    if (str.length > limit) {
        if (limit < 4) {
            return str.slice(0, limit);
        }
        return str.slice(0, limit - 3) + '...';
    }
    return str;
}

const MinimizeStr = (str) => {
    return str.replace(/[-\s]/g, '').toLowerCase();
}


export {
    Capitalize,ReduceString, MinimizeStr
}

