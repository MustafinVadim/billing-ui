import { init } from "./actions";

export const withInit = (configureStore) => (...args) => {
    const store = configureStore.apply(null, args);

    store.dispatch(init());

    return store;
};
