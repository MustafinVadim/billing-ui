import { getNodeStyling } from "../../helpers/NodeHelper";

const HIDDEN_STYLE = `
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

export default node => {
    const emptyValue = "q";
    let hiddenElement;

    if (!hiddenElement) {
        hiddenElement = document.createElement("span");
        document.body.appendChild(hiddenElement);
    }

    const { paddingSize, borderSize, boxSizing, sizingStyle } = getNodeStyling(node);

    hiddenElement.setAttribute("style", sizingStyle + ";" + HIDDEN_STYLE);
    hiddenElement.innerText = node.value || node.placeholder || emptyValue;

    let width = hiddenElement.clientWidth;

    if (boxSizing === "border-box") {
        width = width + borderSize;
    } else if (boxSizing === "content-box") {
        width = width - paddingSize;
    }

    return width;
};
