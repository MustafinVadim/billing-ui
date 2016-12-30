import { call, put } from "redux-saga/effects";
import axios from "./axios";
import Logger, { generateAjaxErrorMessage } from "../helpers/Logger";
import Informer from "Informer";

export const httpMethod = {
    get: "get",
    post: "post",
    put: "put",
    delete: "delete",
    patch: "patch",
    trace: "trace",
    connect: "connect",
    options: "options",
    head: "head"
};

export const DEFAULT_ERROR_MESSAGE = "Ошибка сервера. Попробуйте чуть позже.";

export function* fetchData({
    url,
    data = null,
    onBegin = null,
    onSuccess,
    onError = null,
    requestMethod = httpMethod.post,
    additionalResponseData = null
}) {
    if (onBegin) {
        yield put(onBegin(additionalResponseData));
    }

    try {
        const params = requestMethod === httpMethod.get ? { params: data } : data;
        const response = yield call(axios[requestMethod], url, params);
        const responseData = additionalResponseData ? {
            ...response.data,
            ...additionalResponseData
        } : response.data;

        yield put(onSuccess(responseData));
    } catch (e) {
        Informer.showError(DEFAULT_ERROR_MESSAGE);
        Logger.error(generateAjaxErrorMessage({ url, requestMethod, data, errorMessage: e.message }));
        if (onError) {
            const errorData = additionalResponseData ? { ...additionalResponseData, error: e } : e;
            yield put(onError(errorData));
        }
    }
}
