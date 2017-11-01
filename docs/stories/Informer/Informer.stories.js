import React from "react";
import { storiesOf } from "@storybook/react";
import { number, select, text } from "@storybook/addon-knobs";
import { IconTypes, InformerStatus } from "../../../components/Informer";
import { InformerWrapper } from "./Informer";

storiesOf("Informer", module)
    .add("main", () => (
        <InformerWrapper
            message={text("message", "Hello, world!")}
            hideInterval={number("hideInterval", 4000)}
            status={select("status", Object.keys(InformerStatus), InformerStatus.expectation)}
            iconType={select("iconType", Object.values(IconTypes))}
        />
    ));
