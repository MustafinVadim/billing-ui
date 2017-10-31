import React from "react";
import { storiesOf } from "@storybook/react";
import { text, boolean, number, array } from "@storybook/addon-knobs";
import Icon, { IconTypes } from "../../../components/Icon";

storiesOf("Icon", module)
    .addWithInfo("main", () => (
        <div style={{ display: "flex", width: "900px", "flex-wrap": "wrap" }}>
            {Object.keys(IconTypes).map((iconType) => (
                <div style={{ "margin": "0 10px 20px", width: "250px" }}>
                    <Icon
                        type={IconTypes[iconType]}
                        isStrikeout={false}
                    />
                    <span style={{ "margin-left": "10px" }}>{iconType}</span>
                </div>
            ))}
        </div>
    ));
