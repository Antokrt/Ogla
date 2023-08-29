export const FormatCount = (likes) => {
    if (likes < 10000) {
        return likes.toString();
    } else if (likes < 1000000) {
        const formattedLikes = Math.floor(likes / 1000);
        const decimal = Math.floor((likes % 1000) / 100);
        return `${formattedLikes}.${decimal}K`;
    } else if (likes < 1000000000) {
        const formattedLikes = Math.floor(likes / 1000000);
        const decimal = Math.floor((likes % 1000000) / 100000);
        return `${formattedLikes}.${decimal}M`;
    } else {
        const formattedLikes = Math.floor(likes / 1000000000);
        const decimal = Math.floor((likes % 1000000000) / 100000000);
        return `${formattedLikes}.${decimal}MD`;
    }
}