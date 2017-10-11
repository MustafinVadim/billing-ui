import { isUpperCase } from "./StringHelpers";

export const addValueByKey = (key, value, obj) => {
    obj[key] = value;
    return obj;
};

export const justConstants = (obj = {}) =>
    Object.keys(obj)
        .filter(isUpperCase)
        .reduce((result, key) => addValueByKey(key, obj[key], result), {});

export const enumInfoMapper = (descriptions = {}) => (type, defaultResult) => {
    const description = descriptions[type];
    if (description !== undefined) {
        return description;
    }

    if (defaultResult !== undefined) {
        return defaultResult;
    }

    return type;
};
