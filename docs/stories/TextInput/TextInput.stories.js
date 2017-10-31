import React from "react";
import { storiesOf } from "@storybook/react";
import { text, boolean, number } from "@storybook/addon-knobs";
import { TextInputType } from "../../../components/TextInput";
import { TextInputWrapper } from "./TextInputWrapper";

storiesOf("TextInput", module)
    .addWithInfo("default", () => (
        <TextInputWrapper
            value="Hello, world!"
            validateOnMount={true}
            placeholder={text("placeholder", "Введите текст")}
            maxLength={number("maxLength", undefined)}
            clearable={boolean("clearable", false)}
            disabled={boolean("disabled", false)}
            isValid={boolean("isValid", true)}
            readonly={boolean("readonly", false)}
            width={number("width", 400)}
            height={number("height", undefined)}
        />
    ))
    .addWithInfo("compact", () => (
        <TextInputWrapper
            value="Я Я Я"
            validateOnMount={true}
            placeholder={text("placeholder", "ФИО")}
            maxCounter={number("maxCounter", undefined)}
            maxLength={number("maxLength", undefined)}
            clearable={boolean("clearable", false)}
            disabled={boolean("disabled", false)}
            isValid={boolean("isValid", true)}
            readonly={boolean("readonly", false)}
            width={number("width", 400)}
            type={TextInputType.compact}
        />
    ));
