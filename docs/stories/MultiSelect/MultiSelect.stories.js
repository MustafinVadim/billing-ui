import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { text, select } from "@storybook/addon-knobs";
import { MultiSelectWrapper } from "./MultiSelect";
import { PositionTypes } from "../../../components/Tooltip";

storiesOf("MultiSelect", module)
    .add("main", () => (
        <MultiSelectWrapper
            onAddLabel={action("add label")}
            onRemoveLabel={action("remove label")}
            onChangeLabel={action("change label")}
            onChange={action("change")}
            onChangeLabelComplete={action("edit label complete")}

            placeholder={text("placeholder", "Write email-s")}
        />
    ));
