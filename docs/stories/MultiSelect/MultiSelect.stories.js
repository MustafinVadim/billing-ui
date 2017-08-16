import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { MultiSelectWrapper } from "./MultiSelect";

storiesOf("MultiSelect", module)
    .add("main", () => (
        <MultiSelectWrapper
            onAddLabel={action("add label")}
            onRemoveLabel={action("remove label")}
            onChangeLabel={action("change label")}
            onChange={action("change")}
        />
    ));
