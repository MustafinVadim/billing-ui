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

let nodeStyleCache = {};
let hiddenTextarea;

const getNodeStyling = node => {
    const nodeId = `${node.getAttribute("id")}_${node.getAttribute("name")}_${node.getAttribute("class")}`;

    if (nodeStyleCache[nodeId]) {
        return nodeStyleCache[nodeId];
    }

    const style = window.getComputedStyle(node);

    const boxSizing = style.getPropertyValue("box-sizing");

    const paddingSize = (
        parseFloat(style.getPropertyValue("padding-bottom")) +
        parseFloat(style.getPropertyValue("padding-top"))
    );

    const borderSize = (
        parseFloat(style.getPropertyValue("border-bottom-width")) +
        parseFloat(style.getPropertyValue("border-top-width"))
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

export default node => {
    const emptyValue = "q";

    if (!hiddenTextarea) {
        hiddenTextarea = document.createElement("textarea");
        document.body.appendChild(hiddenTextarea);
    }

    const { paddingSize, borderSize, boxSizing, sizingStyle } = getNodeStyling(node);

    hiddenTextarea.setAttribute("style", sizingStyle + ";" + HIDDEN_TEXTAREA_STYLE);
    hiddenTextarea.value = node.value || node.placeholder || emptyValue;

    let height = hiddenTextarea.scrollHeight;

    if (boxSizing === "border-box") {
        height = height + borderSize;
    } else if (boxSizing === "content-box") {
        height = height - paddingSize;
    }

    return height;
};
