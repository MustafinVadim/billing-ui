import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { text, boolean, number } from "@storybook/addon-knobs";
import { AutocompleteWrapper } from "./Autocomplete";

storiesOf("Autocomplete", module)
    .addWithInfo("main", () => (
        <AutocompleteWrapper
            hasSearchIcon={boolean("has search icon", false)}
            clearOnSelect={boolean("clear on select", false)}
            closeOnSelect={boolean("close on select", true)}
            openIfEmpty={boolean("open if empty", false)}
            openIfNotFound={boolean("open if not found", true)}
            defaultValue={text("default value", "")}
            notFoundText={text("not found text", undefined)}
            maxMenuHeight={number("max menu height", undefined)}
            onChange={action("change")}

            placeholder={text("placeholder", "Write some text")}
        />
    ));
