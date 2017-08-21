import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { boolean, number, date } from "@storybook/addon-knobs";
import { CalendarWrapper } from "./Calendar";

import moment from "../../../libs/moment";

const ENABLED_DATE_RANGE = 3;
const HIGHLIGHTED_DATE_RANGE = 1;



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
            minDate={date("min date", moment().subtract(ENABLED_DATE_RANGE, "days").toDate())}
            maxDate={date("max date", moment().add(ENABLED_DATE_RANGE, "days").toDate())}
            minHighlightedDate={date("min highlighted date", moment().subtract(HIGHLIGHTED_DATE_RANGE, "days").toDate())}
            maxHighlightedDate={date("max highlighted date", moment().add(HIGHLIGHTED_DATE_RANGE, "days").toDate())}
            width={number("width", 115)}
        />
    ));
