import { compose, createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";

import { init } from "./actions";
import analyticsMiddleware from "./analyticsMiddleware";
const __DEV__ = process.env.NODE_ENV !== "production";

if (__DEV__) {
    const reactPerf = require("react-addons-perf");
    window.ReactPerf = reactPerf;
}

const includeDevTools = () => {
    if (__DEV__ && window && window.devToolsExtension) {
        return window.devToolsExtension();
    }

    return f => f;
};

const _createStore = (initialState, rootReducer, outerMiddleware = []) => {
    const middleware = [thunk, analyticsMiddleware].concat(outerMiddleware);
    const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middleware),
            includeDevTools()
        )
    );

    return store;
};

export const configureStore = (initialState, rootReducer, rootSaga = null) => {
    if (rootSaga === null) {
        return _createStore(initialState, rootReducer);
    }

    const sagaMiddleware = createSagaMiddleware();
    const store = _createStore(initialState, rootReducer, [sagaMiddleware]);
    sagaMiddleware.run(rootSaga);
    store.dispatch(init());

    return store;
};

export default configureStore;
