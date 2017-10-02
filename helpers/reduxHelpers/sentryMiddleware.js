import Raven from "raven-js";
import omit from "lodash/omit";
import { sentryLogLevel } from "../Logger/constants";

const BREADCRUMB_CATEGORY = "redux-action";
const FIELDS_TO_FILTER = ["componentsMetaInfo", "routing"];

const sentryMiddleware = (store) => (next) => (action) => {
    const { type, payload } = action;

    const isPossibleError = (type || "").toLowerCase().indexOf("error") >= 0;

    const breadcrumb = {
        message: type,
        category: BREADCRUMB_CATEGORY,
        data: {
            payload,
            state: omit(store.getState(), FIELDS_TO_FILTER)
        },
        level: isPossibleError ? sentryLogLevel.error : sentryLogLevel.info
    };

    Raven.captureBreadcrumb(breadcrumb);

    return next(action);
};

export default sentryMiddleware;
