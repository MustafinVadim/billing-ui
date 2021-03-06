import axios from "axios";

export { prepareRequestData, httpMethod } from "./axios-utils";

const instance = axios.create({ headers: { "X-Requested-With": "XMLHttpRequest" } });

instance.interceptors.request.use(config => {
    const { method, params } = config;

    if (method.toLowerCase() === "get") {
        config.params = { ...params, _: +new Date() };
    }

    return config;
});

export default instance;

