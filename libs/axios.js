import axios from "axios";

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

const instance = axios.create({ headers: { "X-Requested-With": "XMLHttpRequest" } });

instance.interceptors.request.use(config => {
    const { method, params } = config;

    if (method.toLowerCase() === "get") {
        config.params = { ...params, _: +new Date() };
    }

    return config;
});

export default instance;

