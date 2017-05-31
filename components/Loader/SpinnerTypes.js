export const SpinnerTypes = {
    big: "big",
    mini: "mini",
    normal: "normal"
};

export const sizeMaps = {
    [SpinnerTypes.mini]: {
        height: 16,
        width: 16,
        viewBox: null,
        strokeWidth: 1.5
    },
    [SpinnerTypes.normal]: {
        height: 35,
        width: 47,
        viewBox: null,
        strokeWidth: 2
    },
    [SpinnerTypes.big]: {
        height: 70,
        width: 94,
        viewBox: "0 0 47 35",
        strokeWidth: 2
    }
};
