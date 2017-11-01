import React from "react";

import Button from "../../../components/Button";
import Informer, { IconTypes, InformerStatus } from "../../../components/Informer";

export class InformerWrapper extends React.PureComponent {
    _handleClick = () => {
        Informer.show(this.props);
    };

    _handleClickRandom = () => {
        const statuses = Object.keys(InformerStatus);
        const iconTypes = Object.values(IconTypes);
        const messages = [
            "Hello, world",
            "The world is not enough",
            "Six degrees of inner turbulence",
            "Images and words",
            "When dream and day unite",
            "Dramatic turn of events",
            "Our new world",
            "Our new hello world",
            "Machine head",
            "The house of blue light",
            "The man comes around"
        ];

        const randomStatusIndex = Math.floor(Math.random() * statuses.length);
        const randomIconIndex = Math.floor(Math.random() * iconTypes.length);
        const randomInterval = Math.floor(Math.random() * 6000);
        const randomMessageIndex = Math.floor(Math.random() * messages.length);

        Informer.show({
            message: messages[randomMessageIndex],
            status: statuses[randomStatusIndex],
            iconType: iconTypes[randomIconIndex],
            hideInterval: randomInterval
        });
    };

    render() {
        return (
            <div style={{ marginTop: 50 }}>
                <Button onClick={this._handleClick} attributes={{ style: { display: "inline-block" } }}>
                    Show informer with passed props
                </Button>
                <Button onClick={this._handleClickRandom} attributes={{ style: { marginLeft: 50, display: "inline-block" } }}>
                    Show random informer
                </Button>
            </div>
        );
    }
};
