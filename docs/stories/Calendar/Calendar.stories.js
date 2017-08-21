import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { boolean, number, date } from "@storybook/addon-knobs";
import { CalendarWrapper } from "./Calendar";

storiesOf("Calendar", module)
    .add("main", () => (
        <CalendarWrapper
            onChange={action("changed")}
            isValid={boolean("is valid", true)}
            forceInvalid={boolean("force invalid", false)}
            disabled={boolean("disabled", false)}
            isOpened={boolean("is opened", false)}
            maxYear={number("max year", 2100)}
            minYear={number("min year", 1900)}
            maxDate={date("max date", undefined)}
            minDate={date("min date", undefined)}
            width={number("width", 115)}
        />
    ));
