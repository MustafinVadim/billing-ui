import tooltipType from "../TooltipType";
import {
    MARGIN,
    ARROW_RIGHT_MARGIN,
    ARROW_LEFT_MARGIN,
    ARROW_VERTICAL_MARGIN,
    ARROW_HEIGHT
} from "./index";

export const getTooltipPositionType = (tooltipPos, positionTarget, tooltip, type, mainWrapper, positionContainer) => {
    switch (tooltipPos) {
        case "bottom": {
            const margin = type === tooltipType.validation ? -1 : MARGIN;
            const tooltipBottomBorder = positionTarget.top + positionTarget.height + tooltip.offsetHeight + margin;
            const containerBottomBorder = positionContainer ? positionContainer.top + positionContainer.offsetHeight : mainWrapper.clientHeight;

            return tooltipBottomBorder <= mainWrapper.clientHeight && tooltipBottomBorder <= containerBottomBorder
                ? tooltipPos
                : "top";
        }
        case "top": {
            const tooltipTopBorder = positionTarget.top - tooltip.offsetHeight - MARGIN;
            const containerTopBorder = positionContainer ? positionContainer.top : 0;

            return tooltipTopBorder >= 0 && tooltipTopBorder >= containerTopBorder
                ? tooltipPos
                : "bottom";
        }
        case "right": {
            const margin = type === tooltipType.validation ? ARROW_HEIGHT : MARGIN;
            const tooltipRightBorder = positionTarget.left + positionTarget.width + tooltip.offsetWidth + margin;
            const containerRightBorder = positionContainer ? positionContainer.left + positionContainer.offsetWidth : mainWrapper.clientWidth;

            return tooltipRightBorder <= mainWrapper.clientWidth && tooltipRightBorder <= containerRightBorder
                ? tooltipPos
                : "left";
        }
        case "left": {
            const margin = type === tooltipType.validation ? ARROW_HEIGHT : MARGIN;
            const tooltipLeftBorder = positionTarget.left - (tooltip.offsetWidth + margin);
            const containerLeftBorder = positionContainer ? positionContainer.left : 0;

            return tooltipLeftBorder >= 0 && tooltipLeftBorder >= containerLeftBorder
                ? tooltipPos
                : "right";
        }
    }
};

export const getArrowPositionType = (arrowPos, positionTarget, tooltip, type, mainWrapper, positionContainer) => {
    switch (arrowPos) {
        case "center": {
            const tooltipRightBorder = positionTarget.left + positionTarget.width / 2 + tooltip.offsetWidth / 2;
            const containerRightBorder = positionContainer ? positionContainer.left + positionContainer.offsetWidth : mainWrapper.clientWidth;

            const tooltipLeftBorder = positionTarget.left + positionTarget.width / 2 - tooltip.offsetWidth / 2;
            const containerLeftBorder = positionContainer ? positionContainer.left : 0;

            return (
                (tooltipRightBorder < mainWrapper.clientWidth && tooltipRightBorder < containerRightBorder)
                && (tooltipLeftBorder >= 0 && tooltipLeftBorder >= containerLeftBorder)
                    ? arrowPos
                    : tooltipRightBorder > mainWrapper.clientWidth || tooltipRightBorder > containerRightBorder
                    ? "right"
                    : "left"
            )
        }
        case "left": {
            const leftMargin = type === tooltipType.validation ? 0 : ARROW_LEFT_MARGIN;

            const tooltipRightBorder = positionTarget.left - leftMargin + tooltip.offsetWidth;
            const containerRightBorder = positionContainer ? positionContainer.left + positionContainer.offsetWidth : mainWrapper.clientWidth;

            return tooltipRightBorder <= mainWrapper.clientWidth && tooltipRightBorder <= containerRightBorder
                ? arrowPos
                : "right";
        }
        case "right": {
            const rightMargin = type === tooltipType.validation ? 0 : ARROW_RIGHT_MARGIN;

            const tooltipLeftBorder = positionTarget.left + positionTarget.width - tooltip.offsetWidth + rightMargin;
            const containerLeftBorder = positionContainer ? positionContainer.left : 0;

            return tooltipLeftBorder >= 0 && tooltipLeftBorder >= containerLeftBorder
                ? arrowPos
                : "left";
        }
        case "middle": {
            const arrowPoints = type === tooltipType.validation ? positionTarget.height : positionTarget.height / 2;

            const tooltipBottomBorder = positionTarget.top + arrowPoints + tooltip.offsetHeight / 2;
            const containerBottomBorder = positionContainer ? positionContainer.top + positionContainer.offsetHeight : mainWrapper.clientHeight;

            const tooltipTopBorder = positionTarget.top + arrowPoints - tooltip.offsetHeight / 2;
            const containerTopBorder = positionContainer ? positionContainer.top : 0;

            return (
                (tooltipBottomBorder <= mainWrapper.clientHeight && tooltipBottomBorder <= containerBottomBorder)
                && (tooltipTopBorder >= 0 && tooltipTopBorder >= containerTopBorder)
                    ? "middle"
                    : tooltipBottomBorder > mainWrapper.clientHeight || tooltipBottomBorder > containerBottomBorder
                    ? "bottom"
                    : "top"
            )
        }
        case "top": {
            const arrowPoints = type === tooltipType.validation ? positionTarget.height : positionTarget.height / 2;

            const tooltipBottomBorder = positionTarget.top + arrowPoints + tooltip.offsetHeight - ARROW_VERTICAL_MARGIN - ARROW_HEIGHT;
            const containerBottomBorder = positionContainer ? positionContainer.top + positionContainer.offsetHeight : mainWrapper.clientHeight;

            return tooltipBottomBorder <= mainWrapper.clientHeight && tooltipBottomBorder <= containerBottomBorder
                ? arrowPos
                : "bottom";
        }
        case "bottom": {
            const arrowPoints = type === tooltipType.validation ? positionTarget.height : positionTarget.height / 2;

            const tooltipTopBorder = positionTarget.top + arrowPoints - tooltip.offsetHeight + ARROW_VERTICAL_MARGIN + ARROW_HEIGHT;
            const containerTopBorder = positionContainer ? positionContainer.top : 0;

            return tooltipTopBorder >= 0 && tooltipTopBorder >= containerTopBorder
                ? arrowPos
                : "top";
        }
    }
};
