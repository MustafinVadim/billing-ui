import { storiesOf } from "@storybook/react";
import { boolean } from "@storybook/addon-knobs";
import { CheckboxWrapper } from "./CheckboxWrapper";

storiesOf("Checkbox", module)
    .addWithInfo("main", () => (
        <CheckboxWrapper
            checked={boolean("checked", false)}
            disabled={boolean("disabled", false)}
            readonly={boolean("readonly", false)}
        />
    ));
