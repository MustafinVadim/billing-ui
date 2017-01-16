export const findContainer = (node, containerNodeSelector) => {
    let container = node;

    if (containerNodeSelector) {
        while (container && container.className.indexOf(containerNodeSelector) === -1 && container.id.indexOf(containerNodeSelector) === -1) {
            container = container.parentElement;
        }
    } else {
        while (container && container.parentElement.tagName !== document.body.tagName) {
            container = container.parentElement;
        }
    }

    return container;
};

export const getMarginTop = node => {
    var styles = window.getComputedStyle(node);
    return Math.ceil(parseFloat(styles.marginTop));
};

export const getMarginBottom = node => {
    var styles = window.getComputedStyle(node);
    return Math.ceil(parseFloat(styles.marginBottom));
};

export const getAbsoluteHeight = node => {
    var margin = getMarginTop(node) + getMarginBottom(node);

    return Math.ceil(node.offsetHeight + margin);
};
