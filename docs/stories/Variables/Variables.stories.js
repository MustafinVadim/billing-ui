import React from "react";
import { storiesOf } from "@storybook/react";
import Colors from "./Colors";
import FontSettings from "./FontSettings";

storiesOf("Константы системы", module)
    .add("Цвета", () => <Colors />)
    .add("Шрифты", () => <FontSettings />);
