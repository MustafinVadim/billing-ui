import ReactDOM from "react-dom";
import InformerStatus from "./InformerStatus";
import Informer, { ANIMATION_DURATION } from "./Informer";
import { IconTypes } from "../Icon";

let instance = null;

class InformersManager {
    constructor() {
        this._queue = [];
        this._showingMessage = null;
        this._isShowing = false;
        this._node = document.createElement("div");
        document.body.appendChild(this._node);
    }

    static instance() {
        if (!instance) {
            instance = new InformersManager();
        }

        return instance;
    }

    show({
             message,
             status = InformerStatus.expectation,
             iconType,
             hideInterval = 4000
         }) {
        this._queue.push({ message, status, iconType, hideInterval });

        if (!this._isShowing) {
            this._isShowing = true;
            this._showMessage();
        }
    }

    showSuccess(message, hideInterval) {
        this.show({
            message,
            status: InformerStatus.success,
            iconType: IconTypes.Ok,
            hideInterval
        });
    }

    showWaiting(message, hideInterval) {
        this.show({
            message,
            status: InformerStatus.expectation,
            iconType: IconTypes.Clock,
            hideInterval
        });
    }

    showNotification(message, hideInterval) {
        this.show({
            message,
            status: InformerStatus.expectation,
            iconType: IconTypes.Warning,
            hideInterval
        });
    }

    showError(message, hideInterval) {
        this.show({
            message,
            status: InformerStatus.error,
            iconType: IconTypes.Error,
            hideInterval
        });
    }

    _showMessage = () => {
        const informerData = this._queue.shift();

        if (informerData) {
            this._updateMessageComponent(informerData, true);
            this._beginHideTimer = setTimeout(this._updateMessageComponent.bind(this, informerData), informerData.hideInterval - ANIMATION_DURATION);
            this._updateTimer = setTimeout(this._showMessage, informerData.hideInterval);
        } else {
            this._updateMessageComponent();
            this._isShowing = false;
        }
    };

    _handleInformerClick = (informerData) => {
        this._updateMessageComponent(informerData);
        setTimeout(this._showMessage, ANIMATION_DURATION);
        clearTimeout(this._beginHideTimer);
        clearTimeout(this._updateTimer);
    };

    _updateMessageComponent(informerData, isVisible) {
        ReactDOM.render(
            <Informer {...informerData} isVisible={isVisible} onClick={this._handleInformerClick} />,
            this._node
        );
    }
}

export default InformersManager.instance();
