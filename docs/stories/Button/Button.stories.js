import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean, select } from "@storybook/addon-knobs";
import Button, { ButtonSize, AppearanceType } from "../../../components/Button";

storiesOf("Button", module)
    .addWithInfo("default", () => (
        <Button
            active={boolean("active", false)}
            disabled={boolean("disabled", false)}
            size={select("size", Object.keys(ButtonSize), ButtonSize.default)}
        >
            Нажми меня
        </Button>
    ))
    .addWithInfo("delete", () => (
        <Button
            appearance={AppearanceType.delete}
            active={boolean("active", false)}
            disabled={boolean("disabled", false)}
            size={select("size", Object.keys(ButtonSize), ButtonSize.default)}
        >
            Удалить
        </Button>
    ))
    .addWithInfo("important", () => (
        <Button
            appearance={AppearanceType.important}
            active={boolean("active", false)}
            disabled={boolean("disabled", false)}
            size={select("size", Object.keys(ButtonSize), ButtonSize.default)}
        >
            Сохранить
        </Button>
    ));
