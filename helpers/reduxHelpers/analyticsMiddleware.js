import GoogleAnalytics from "./../GoogleAnalytics";

const extractAnalytics = (ga) => {
    if (Array.isArray(ga)) {
        ga.forEach(g => extractAnalytics(g));
    } else {
        if (!ga) {
            return;
        }

        const { category, action, label, value } = ga;
        GoogleAnalytics.triggerEventAsync(category, action, label, value);
    }
};

const analyticsMiddleware = (store) => (dispatch) => (action) => {
    const { meta } = action;

    if (meta && meta.ga) {
        extractAnalytics(meta.ga);
    }

    return dispatch(action);
};

export default analyticsMiddleware;
