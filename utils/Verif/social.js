export const isValidFacebookUrl = (url) => {
    const regex = new RegExp("^https:\/\/(?:www\.)?facebook\.com\/[^\\s]+$");
    const match = url.match(regex);
    return !!match;
}

function isValidTwitterUsername(url) {
    const regex = new RegExp("^@[a-zA-Z0-9_]{3,16}$");
    const match = url.match(regex);
    return !!match;
}

