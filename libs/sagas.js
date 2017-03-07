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

function* createPutEffects(actionCreators, payload) {
    if (Array.isArray(actionCreators)) {
        yield actionCreators.map(action => put(action(payload)));
    }

    if (typeof actionCreators === "function") {
        yield put(actionCreators(payload));
    }
}

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
        yield* createPutEffects(onBegin, additionalResponseData);
    }

    try {
        const params = requestMethod === httpMethod.get ? { params: data } : data;
        const response = yield call(axios[requestMethod], url, params);
        const responseData = additionalResponseData ? {
            ...response.data,
            ...additionalResponseData
        } : response.data;

        yield* createPutEffects(onSuccess, responseData);
    } catch (xhr) {
        let errorMessage = DEFAULT_ERROR_MESSAGE;
        try {
            errorMessage = JSON.parse(xhr.responseText).message;
        } catch (e) {
        }

        Informer.showError(errorMessage);
        Logger.error(generateAjaxErrorMessage({ url, requestMethod, data, errorMessage: xhr.message }));
        if (onError) {
            const errorData = additionalResponseData ? { ...additionalResponseData, error: xhr } : xhr;
            yield* createPutEffects(onError, errorData);
        }
    }
}
