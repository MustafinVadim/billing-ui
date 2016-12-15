import Themes from "./Themes";

import generalTheme from "./General.scss";
import generalSmallTheme from "./GeneralSmall.scss";
import tileTheme from "./Tile.scss";

export default (type) => {
    switch (type) {
        case Themes.GeneralTheme:
            return generalTheme;
        case Themes.GeneralSmallTheme:
            return generalSmallTheme;
        case Themes.TileTheme:
            return tileTheme;
        default:
            return {};
    }
}
