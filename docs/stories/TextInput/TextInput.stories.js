import React from "react";
import { storiesOf, action } from "@kadira/storybook";
import { text, boolean, number } from "@kadira/storybook-addon-knobs";

import "./../../src/css/icon-fonts.scss";
import { TextInputWrapper } from "./TextInputWrapper";

storiesOf("TextInput", module)
    .add("main", () => (
        <TextInputWrapper value={text("value", "Hello, world!")}
                          onChange={action("changed")}
                          clearable={boolean("clearable", false)}
                          placeholder={text("placeholder", "Write some text")}
                          readonly={boolean("readonly", false)}
                          width={number("width", 400)}
                          height={number("height", undefined)}
                          type={text("type", "default")}
        />
    ));
