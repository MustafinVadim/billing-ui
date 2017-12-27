import { call, put } from "redux-saga/effects";
import axios, { httpMethod, prepareRequestData } from "./axios";
import Logger, { generateAjaxErrorMessage } from "../helpers/Logger";
import Informer from "../components/Informer";
import isEmpty from "lodash/isEmpty";

export { httpMethod } from "./axios";

export const httpStatusCodes = {
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    MULTI_STATUS: 207,
    ALREADY_REPORTED: 208,
    IM_USED: 226,
    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    USE_PROXY: 305,
    SWITCH_PROXY: 306,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    REQUEST_ENTITY_TOO_LARGE: 413,
    REQUEST_URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    REQUESTED_RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    IM_A_TEAPOT: 418,
    MISDIRECTED_REQUEST: 421,
    UNPROCESSABLE_ENTITY: 422,
    UPGRADE_REQUIRED: 426,
    PRECONDITION_REQUIRED: 428,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    TOO_MANY_REQUESTS: 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
    UNAVAILABLE_FOR_LEGAL_REASONS: 451,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505,
    VARIANT_ALSO_NEGOTIATES: 506,
    INSUFFICIENT_STORAGE: 507,
    LOOP_DETECTED: 508,
    NOT_EXTENDED: 510,
    NETWORK_AUTHENTICATION_REQUIRED: 511
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

const mergeHandlers = (statusHandlers, requestResultHandlers) => {
    let handlers = statusHandlers
        ? Array.isArray(statusHandlers) ? [...statusHandlers] : [statusHandlers]
        : [];

    handlers = requestResultHandlers
        ? Array.isArray(requestResultHandlers) ? [...requestResultHandlers, ...handlers] : [requestResultHandlers, ...handlers]
        : [...handlers];

    return handlers;
};

export const extractMessageFromError = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }

    if (error.message) {
        return error.message;
    }

    return DEFAULT_ERROR_MESSAGE;
};

export const extractResponseObjectFromError = (error) => {
    if (error.response && error.response.data && error.response.data.obj) {
        return error.response.data.obj;
    }
    return {};
};

export function* fetchData({
    url,
    data = null,
    onBegin = null,
    onSuccess,
    onError = null,
    requestMethod = httpMethod.post,
    additionalResponseData = null,
    statusHandlers = {},
    showInformer = true
}) {
    if (onBegin) {
        yield* createPutEffects(onBegin, additionalResponseData);
    }

    try {
        const params = prepareRequestData(requestMethod, data);
        const response = yield call(axios[requestMethod], url, params);
        const responseData = additionalResponseData ? {
            ...response.data,
            ...additionalResponseData
        } : response.data;
        const successHandlers = mergeHandlers(statusHandlers[response.status], onSuccess);

        if (successHandlers.length > 0) {
            yield* createPutEffects(successHandlers, responseData);
        }

        return {
            isSuccess: true,
            response,
            responseData
        };
    } catch (error) {
        const errorMessage = extractMessageFromError(error);
        const errorObject = extractResponseObjectFromError(error);

        if (showInformer || isEmpty(errorObject)) {
            Informer.showError(errorMessage);
        }

        Logger.error(generateAjaxErrorMessage({ url, requestMethod, data, errorMessage }));

        const errorHandlers = mergeHandlers(statusHandlers[error.response.status], onError);

        if (errorHandlers.length > 0) {
            const errorData = {
                ...additionalResponseData,
                error,
                errorObject,
                errorMessage
            };
            yield* createPutEffects(errorHandlers, errorData);
        }

        return {
            isSuccess: false,
            errorMessage,
            errorObject,
            error
        };
    }
}
