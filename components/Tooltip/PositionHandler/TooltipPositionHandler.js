import tooltipType from "../TooltipType";
import {
    MARGIN,
    ARROW_RIGHT_MARGIN,
    ARROW_LEFT_MARGIN,
    ARROW_VERTICAL_MARGIN,
    ARROW_HEIGHT
} from "./index";

export const getTopPosition = (positionType, positionTarget, tooltip, type, { bottom = 0, top = 0 }) => {
    const [tooltipPos, arrowPos] = positionType.split(" ");
    const stickyTooltip = type === tooltipType.validation || type === tooltipType.warning;

    switch (tooltipPos) {
        case "bottom": {
            const bottomMargin = stickyTooltip ? -1 : MARGIN;
            return positionTarget.height + bottomMargin + bottom;
        }
        case "top": {
            return -tooltip.offsetHeight - MARGIN + top;
        }
    }

    switch (arrowPos) {
        case "middle": {
            const arrowPoints = stickyTooltip ? positionTarget.height : Math.floor(positionTarget.height / 2);
            return arrowPoints - Math.floor(tooltip.offsetHeight / 2) + top;
        }
        case "top": {
            const arrowPoints = stickyTooltip ? positionTarget.height - ARROW_HEIGHT : 0;
            return arrowPoints - ARROW_VERTICAL_MARGIN + top;
        }
        case "bottom": {
            const arrowVerticalMargin = ARROW_VERTICAL_MARGIN + (stickyTooltip ? ARROW_HEIGHT : 0);
            return positionTarget.height - tooltip.offsetHeight + arrowVerticalMargin + bottom;
        }
    }
};

export const getLeftPosition = (positionType, positionTarget, tooltip, type, { right = 0, left = 0 }) => {
    const [tooltipPos, arrowPos] = positionType.split(" ");
    const stickyTooltip = type === tooltipType.validation || type === tooltipType.warning;
    const margin = stickyTooltip ? 0 : MARGIN;

    switch (tooltipPos) {
        case "right":
            return positionTarget.width + margin + right;
        case "left":
            return -tooltip.offsetWidth - margin + left;
    }

    switch (arrowPos) {
        case "center":
            return Math.floor(positionTarget.width / 2) - Math.floor(tooltip.offsetWidth / 2) + left;
        case "left":
            return stickyTooltip ? 0 : -ARROW_LEFT_MARGIN + left;
        case "right":
            const rightMargin = stickyTooltip ? 0 : ARROW_RIGHT_MARGIN;
            return positionTarget.width - tooltip.offsetWidth + rightMargin + right;
    }
};
