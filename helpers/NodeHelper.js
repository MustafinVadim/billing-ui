export const findContainerBySelector = (node, containerNodeSelector) => {
    return findContainer(node, container => container.className.indexOf(containerNodeSelector) !== -1 || container.id.indexOf(containerNodeSelector) !== -1);
};

export const findContainerWithOverflowHidden = (node) => {
    return findContainer(node.parentElement, container => window.getComputedStyle(container).overflow === "hidden");
};

export const findContainer = (node, predicate) => {
    let container = node;
    predicate = predicate || (parent => container.parentElement.tagName === document.body.tagName);

    while (container && !predicate(container)) {
        container = container.parentElement;
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

export const getPositionNode = (node) => {
    const boundingClientRect = node.getBoundingClientRect();

    return {
        top: boundingClientRect.top,
        bottom: boundingClientRect.bottom,
        left: boundingClientRect.left,
        right: boundingClientRect.right,
        height: boundingClientRect.height,
        width: boundingClientRect.width,
        offsetWidth: node.offsetWidth,
        offsetHeight: node.offsetHeight,
        offsetTop: node.offsetTop,
        offsetLeft: node.offsetLeft
    }
};
