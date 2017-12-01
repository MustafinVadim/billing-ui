export const httpMethod = {
    "get": "get",
    "post": "post",
    "put": "put",
    "delete": "delete",
    "patch": "patch",
    "trace": "trace",
    "connect": "connect",
    "options": "options",
    "head": "head"
};

export const prepareRequestData = (requestMethod, requestData) => requestMethod === httpMethod.get ? { params: requestData } : requestData;
