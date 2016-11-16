import { call, put } from "redux-saga/effects";
import axios from "./axios";
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

export function* fetchData({ url, data = null, onBegin = null, onSuccess, onError = null, requestMethod = httpMethod.post }) {
    if (onBegin) {
        yield put(onBegin());
    }

    try {
        const params = requestMethod === httpMethod.get ? { params: data } : data;
        const response = yield call(axios[requestMethod], url, params);

        yield put(onSuccess(response.data));
    } catch (e) {
        Informer.showError(e.message);
        if (onError) {
            yield put(onError(e));
        }
    }
}
