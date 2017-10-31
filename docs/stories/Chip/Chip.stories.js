import React from "react";
import { storiesOf } from "@storybook/react";
import Chip from "../../../components/Chip";

storiesOf("Chip", module)
    .addWithInfo("main", () => (
        <Chip>
            Иванов Иван Иванович
        </Chip>
    ));
