export const safeDecodeURI = (text) => {
    try {
        return text ? decodeURIComponent(text) : text;
    } catch (e) {
        return text
    }
};

export const safeEncodeURI = (text) => {
    try {
        return text ? encodeURIComponent(text) : text;
    } catch (e) {
        return text
    }
};

export default {
    safeDecodeURI,
    safeEncodeURI
};
