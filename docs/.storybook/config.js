import { configure, setAddon, addDecorator } from "@storybook/react";
import infoAddon from "@storybook/addon-info";
import { withKnobs } from "@storybook/addon-knobs";
import backgrounds from "@storybook/addon-backgrounds";

import "../src/css/Reset.css";
import "../src/css/icon-fonts.scss";

setAddon(infoAddon);

addDecorator(story => <div style={{ padding: "20px", fontFamily: "Segoe UI,Helvetica Neue,Arial,Tahoma,sans-serif" }}>{story()}</div>);
addDecorator(withKnobs);
addDecorator(backgrounds([
    { name: "main", value: "#ffffff", default: true },
    { name: "menu", value: "#8e3b4b" },
    { name: "info", value: "#ffeccd" },
    { name: "error", value: "#ffaa9d" },
    { name: "body", value: "#e8e8e8" }
]));

const req = require.context("../stories", true, /.stories.js$/);

configure(() => {
    req.keys().forEach((filename) => req(filename));
}, module);
