import { getTopPosition, getLeftPosition } from "./TooltipPositionHandler";
import { getTooltipPositionType, getArrowPositionType } from "./TooltipPositionTypeHandler";
import { getPositionNode, findContainer, findContainerWithOverflowHidden } from "../../../helpers/NodeHelper";

export const MARGIN = 15;
export const ARROW_RIGHT_MARGIN = 20;
export const ARROW_LEFT_MARGIN = 25;
export const ARROW_VERTICAL_MARGIN = 15;
export const ARROW_HEIGHT = 8;

export const calcPosition = (positionType, target, tooltip, type, offsetPosition = {}) => {
    const positionTarget = getPositionNode(target);

    return {
        top: `${getTopPosition(positionType, positionTarget, tooltip, type, offsetPosition)}px`,
        left: `${getLeftPosition(positionType, positionTarget, tooltip, type, offsetPosition)}px`
    }
};

export const adjustPositionType = (positionType, target, tooltip, type, mainWrapper, container) => {
    const foundMainWrapper = mainWrapper || findContainer(target);
    const foundContainer = container || findContainerWithOverflowHidden(target);
    const positionTarget = getPositionNode(target);
    const positionContainer = foundContainer ? getPositionNode(foundContainer) : null;
    const [tooltipPos, arrowPos] = positionType.split(" ");

    return [
        getTooltipPositionType(tooltipPos, positionTarget, tooltip, type, foundMainWrapper, positionContainer),
        getArrowPositionType(arrowPos, positionTarget, tooltip, type, foundMainWrapper, positionContainer)
    ].join(" ");
};
