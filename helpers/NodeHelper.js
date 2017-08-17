export const findContainerBySelector = (node, containerNodeSelector) => {
    return findContainer(node, container => container.className.indexOf(containerNodeSelector) !== -1 || container.id.indexOf(containerNodeSelector) !== -1);
};

export const findContainerWithOverflowHidden = (node) => {
    return findContainer(node.parentElement, container => window.getComputedStyle(container).overflow === "hidden");
};

export const findContainer = (node, predicate) => {
    let container = node;

    if (predicate) {
        while (container && !predicate(container)) {
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
    const styles = window.getComputedStyle(node);
    return Math.ceil(parseFloat(styles.marginTop));
};

export const getMarginBottom = node => {
    const styles = window.getComputedStyle(node);
    return Math.ceil(parseFloat(styles.marginBottom));
};

export const getAbsoluteHeight = node => {
    const margin = getMarginTop(node) + getMarginBottom(node);

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

export const getNodeStyling = node => {
    const SIZING_STYLE = [
        "letter-spacing",
        "line-height",
        "padding-top",
        "padding-bottom",
        "font-family",
        "font-weight",
        "font-size",
        "text-rendering",
        "text-transform",
        "width",
        "text-indent",
        "padding-left",
        "padding-right",
        "border-width",
        "box-sizing"
    ];

    let nodeAttrId = node.getAttribute("id");
    let nodeAttrName = node.getAttribute("name");
    let nodeAttrClass = node.getAttribute("class");
    let nodeId = null;
    let nodeStyleCache = {};

    if (nodeAttrId || nodeAttrName || nodeAttrClass) {
        nodeId = `${nodeAttrId}_${nodeAttrName}_${nodeAttrClass}`;
    }

    if (nodeStyleCache[nodeId]) {
        return nodeStyleCache[nodeId];
    }

    const style = window.getComputedStyle(node);

    const boxSizing = style.getPropertyValue("box-sizing");

    const paddingSize = (
        parseFloat(style.getPropertyValue("padding-bottom"))
        + parseFloat(style.getPropertyValue("padding-top"))
    );

    const borderSize = (
        parseFloat(style.getPropertyValue("border-bottom-width"))
        + parseFloat(style.getPropertyValue("border-top-width"))
    );

    const sizingStyle = SIZING_STYLE
        .map(name => `${name}:${style.getPropertyValue(name)}`)
        .join(";");

    const nodeInfo = {
        sizingStyle,
        paddingSize,
        borderSize,
        boxSizing
    };

    if (nodeId) {
        nodeStyleCache[nodeId] = nodeInfo;
    }

    return nodeInfo;
};

export const calculateContentWidth = node => {
    const HIDDEN_STYLE = `
        white-space: pre !important;
        min-height:0 !important;
        max-height:none !important;
        height:0 !important;
        visibility:hidden !important;
        overflow:hidden !important;
        position:absolute !important;
        z-index:-1000 !important;
        top:0 !important;
        right:0 !important;
        width: auto !important;
    `;

    const defaultValue = "W";
    let hiddenElement;

    if (!hiddenElement) {
        hiddenElement = document.createElement("span");
        document.body.appendChild(hiddenElement);
    }

    const { paddingSize, borderSize, boxSizing, sizingStyle } = getNodeStyling(node);

    hiddenElement.setAttribute("style", sizingStyle + ";" + HIDDEN_STYLE);
    hiddenElement.innerText = (node.value || node.placeholder) + defaultValue;

    let width = hiddenElement.scrollWidth + 2;
    document.body.removeChild(hiddenElement);

    if (boxSizing === "border-box") {
        width = width + borderSize;
    } else if (boxSizing === "content-box") {
        width = width - paddingSize;
    }

    return width;
};

export const calculateContentHeight = node => {
    const HIDDEN_TEXTAREA_STYLE = `
        min-height:0 !important;
        max-height:none !important;
        height:0 !important;
        visibility:hidden !important;
        overflow:hidden !important;
        position:absolute !important;
        z-index:-1000 !important;
        top:0 !important;
        right:0 !important
    `;

    const emptyValue = "q";
    let hiddenTextarea;

    if (!hiddenTextarea) {
        hiddenTextarea = document.createElement("textarea");
        hiddenTextarea.setAttribute("style", HIDDEN_TEXTAREA_STYLE);
        document.body.appendChild(hiddenTextarea);
    }

    const { paddingSize, borderSize, boxSizing, sizingStyle } = getNodeStyling(node);

    hiddenTextarea.setAttribute("style", sizingStyle + ";" + HIDDEN_TEXTAREA_STYLE);
    hiddenTextarea.value = node.value || node.placeholder || emptyValue;

    let height = hiddenTextarea.scrollHeight;
    document.body.removeChild(hiddenTextarea);

    if (boxSizing === "border-box") {
        height = height + borderSize;
    } else if (boxSizing === "content-box") {
        height = height - paddingSize;
    }

    return height;
};
