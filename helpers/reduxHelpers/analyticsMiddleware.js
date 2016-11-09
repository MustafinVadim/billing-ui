import GoogleAnalytics from "./../GoogleAnalytics";

const analyticsMiddleware = (store) => (dispatch) => (action) => {
    const { meta } = action;

    if (meta && meta.ga) {
        const { category, action, label } = meta.ga;
        GoogleAnalytics.triggerEventAsync(category, action, label);
    }

    return dispatch(action);
};

export default analyticsMiddleware;
