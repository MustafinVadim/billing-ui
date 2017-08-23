import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { boolean, number, date, text, color } from "@storybook/addon-knobs";
import { CalendarWrapper } from "./Calendar";

import moment from "../../../libs/moment";

const ENABLED_DATE_RANGE = 15;
const HIGHLIGHTED_DATE_RANGE = 5;

const DEFAULT_MIN_DATE = moment().subtract(ENABLED_DATE_RANGE, "days").toDate();
const DEFAULT_MAX_DATE = moment().add(ENABLED_DATE_RANGE, "days").toDate();

const DEFAULT_MIN_HL_DATE = moment().subtract(HIGHLIGHTED_DATE_RANGE, "days").toDate();
const DEFAULT_MAX_HL_DATE = moment().add(HIGHLIGHTED_DATE_RANGE, "days").toDate();

const DEFAULT_INITIAL_DATE = moment().toDate();

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
            minDate={date("min date", DEFAULT_MIN_DATE)}
            maxDate={date("max date", DEFAULT_MAX_DATE)}
            highlight={{
                minDate: date("min highlighted date", DEFAULT_MIN_HL_DATE),
                maxDate: date("max highlighted date", DEFAULT_MAX_HL_DATE),
                legend: text("legend", "срок бронирования"),
                color: color("highlight color", "#1d9d00")
            }}
            defaultStartDate={date("initial date", DEFAULT_INITIAL_DATE)}
            width={number("width", 115)}
        />
    ));
