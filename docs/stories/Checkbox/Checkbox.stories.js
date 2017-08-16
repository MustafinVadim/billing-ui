import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { CheckboxWrapper } from "./CheckboxWrapper";

storiesOf("Checkbox", module)
    .add("main", () => (
        <CheckboxWrapper checked={boolean("checked", false)}
                         disabled={boolean("disabled", false)}
                         readonly={boolean("readonly", false)}
                         onChange={action("changed")}
        />
    ));
