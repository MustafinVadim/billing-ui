import { enumInfoMapper } from "billing-ui/helpers/ObjectHelpers";

import ActionButtonRow from "./ActionButtonRow";
import ActionButtonLink from "./ActionButtonLink";

const ActionsTheme = {
    row: "row",
    link: "link"
};

ActionsTheme.getButton = enumInfoMapper({
    [ActionsTheme.row]: ActionButtonRow,
    [ActionsTheme.link]: ActionButtonLink
});

ActionsTheme.getOffsetPosition = enumInfoMapper({
    [ActionsTheme.row]: { top: 29, left: 6 },
    [ActionsTheme.link]: { top: 18, left: 10 }
});

export default ActionsTheme;
