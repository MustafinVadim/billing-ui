import React from "react";
import { storiesOf } from "@storybook/react";
import Colors from "./Colors";

storiesOf("Константы системы", module)
    .add("Цвета", () => <Colors />);
