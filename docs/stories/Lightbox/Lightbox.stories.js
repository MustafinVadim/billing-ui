import { storiesOf } from "@storybook/react";
import { boolean, number, select } from "@storybook/addon-knobs";
import Lightbox, { PerfectLightboxPositionTypes } from "../../../components/PerfectLightbox";

storiesOf("Lightbox", module)
    .addWithInfo("top", () => (
        <Lightbox
            closeOnEsc={true}
            isOpened={boolean("isOpened", true)}
            width={number("width", 900)}
        >
            <div style={{"text-align": "center", padding: "300px 0"}}>Привет! Я контент лайтбокса</div>
        </Lightbox>
    ))
    .addWithInfo("middle", () => (
        <Lightbox
            closeOnEsc={false}
            closeOnOutsideClick={true}
            positionType={PerfectLightboxPositionTypes.middle}
            isOpened={boolean("isOpened", true)}
            width={number("width", 600)}
        >
            <div style={{"text-align": "center", padding: "50px 0"}}>Привет! Я контент лайтбокса</div>
        </Lightbox>
    ))
    .addWithInfo("bottom", () => (
        <Lightbox
            closeOnEsc={true}
            positionType={PerfectLightboxPositionTypes.bottom}
            isOpened={boolean("isOpened", true)}
            width={number("width", 900)}
        >
            <div style={{"text-align": "center", padding: "300px 0"}}>Привет! Я контент лайтбокса</div>
        </Lightbox>
    ));
