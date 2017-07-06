import { getNodeStyling } from "../../helpers/NodeHelper";

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

export default node => {
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

    if (boxSizing === "border-box") {
        height = height + borderSize;
    } else if (boxSizing === "content-box") {
        height = height - paddingSize;
    }

    return height;
};
