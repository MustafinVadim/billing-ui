export const getUrlWithQuery = (url, params) => {
    const [pathname, search] = url.split("?");
    const currentParams = ((search || "").split("&")).reduce((result, param) => {
        if (param) {
            const [key, value] = param.split("=");
            result[key] = value;
        }
        return result;
    }, {});
    const newParams = { ...currentParams, ...params };

    const query = [].concat(Object.keys(newParams || {}).map(key => (`${key}=${newParams[key]}`)));
    return query.length > 0 ? `${pathname}?${query.join("&")}` : pathname;
};
