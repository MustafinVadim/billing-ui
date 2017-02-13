const arrayIsNotEmpty = array => Array.isArray(array) && array.length > 0;

export const arrayToObject = (objectsArray, keyName) => {
    let objects = {};

    if (arrayIsNotEmpty(objectsArray) && keyName) {
        objectsArray.forEach(item => {
            const key = item[keyName];
            if (key) {
                objects[key] = item;
            }
        });
    }

    return objects;
};

export const getKeysArray = (objectsArray, keyName) => {
    if (!arrayIsNotEmpty(objectsArray) || !keyName) {
        return [];
    }

    return objectsArray.reduce((result, item) => {
        const key = item[keyName];
        if (key) {
            result.push(key);
        }

        return result;
    }, []);
};
