export const hasCssFeature = (property, value, withPrefixes = false) => {
    const elementStyle = document.createElement("test").style;

    if (Array.isArray(value)) {
        elementStyle.cssText = `${property}:${value.join(`;${property}`)};`;

        return !!elementStyle[property];
    }

    if (withPrefixes) {
        elementStyle.cssText = `${property}:${["-webkit-", "-moz-", "-ms-", "-o-", ""].join(`${value};${property}:${value};`)}`;
    } else {
        elementStyle.cssText = `${property}:${value}`;
    }

    return !!elementStyle[property];
};
