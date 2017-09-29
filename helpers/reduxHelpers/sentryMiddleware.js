import Raven from "raven-js";

const BREADCRUMB_CATEGORY = "redux-action";
const level = {
    error: "error",
    warning: "warning",
    info: "info",
    debug: "debug"
};

const sentryMiddleware = (store) => (next) => (action) => {
    const { type, payload } = action;

    const isPossibleError = (type || "").toLowerCase().indexOf("error") >= 0;

    const breadcrumb = {
        message: type,
        category: BREADCRUMB_CATEGORY,
        data: {
            payload,
            state: store.getState()
        },
        level: isPossibleError ? level.error : level.info
    };

    Raven.captureBreadcrumb(breadcrumb);

    return next(action);
};

export default sentryMiddleware;
