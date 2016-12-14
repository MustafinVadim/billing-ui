import Themes from "./Themes";

import defaultTheme from "./Default.scss";
import defaultSmallTheme from "./DefaultSmall.scss";
import tileTheme from "./Tile.scss";

export default (type) => {
    switch (type) {
        case Themes.DefaultTheme:
            return defaultTheme;
        case Themes.DefaultSmallTheme:
            return defaultSmallTheme;
        case Themes.TileTheme:
            return tileTheme;
        default:
            return {};
    }
}
