import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { text, boolean, number, select } from "@storybook/addon-knobs";
import { TextInputType } from "../../../components/TextInput";
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
                          type={select("type", Object.keys(TextInputType), TextInputType.compact)}
        />
    ));
