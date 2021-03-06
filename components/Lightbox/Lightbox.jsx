import PropTypes from "prop-types";
import { PureComponent } from "react";
import ReactDOM from "react-dom";

/**
 * @deprecated
 */

class Lightbox extends PureComponent {
    componentDidMount() {
        const { isOpen } = this.props;
        this.initLightbox();

        if (isOpen) {
            this.toggleVisibility(isOpen);
        }
    }

    componentDidUpdate(prevProps) {
        const { isOpen } = this.props;
        ReactDOM.render(this.renderLightboxHtml(), this._containerNode);

        if (prevProps.isOpen !== isOpen) {
            this.toggleVisibility(isOpen);
        }
    }

    componentWillUnmount() {
        this.removeLightbox();
    }

    renderLightboxHtml() {
        const { title, children } = this.props;

        return (
            <div className="lb-lightboxWrapper">
                <div className="lb-closeButton"></div>
                <div>
                    <h2 className="lb-title">{title}</h2>
                    {children}
                </div>
            </div>
        );
    }

    renderLightboxContainer(width) {
        const containerEl = document.createElement("div");
        containerEl.className = "lb-lightbox inlineBlock";
        containerEl.style.width = `${width}px`;

        return containerEl;
    }

    createLightbox(lightboxHtml) {
        const { getOpenLink, onClose, onOpen } = this.props;
        // eslint-disable-next-line no-undef
        const lightbox = LightboxTop.create(lightboxHtml, {
            openLink: getOpenLink && getOpenLink()
        });

        if (onOpen) {
            lightbox.onOpenComplete(() => onOpen());
        }

        if (onClose) {
            lightbox.onCloseComplete(() => onClose());
        }

        return lightbox;
    }

    initLightbox() {
        const { width } = this.props;

        this._containerNode = this.renderLightboxContainer(width);
        ReactDOM.render(this.renderLightboxHtml(), this._containerNode);

        // eslint-disable-next-line no-undef
        this._lightboxControl = this.createLightbox(this._containerNode);
    }

    toggleVisibility(isOpen) {
        if (isOpen) {
            this._lightboxControl.open();
        } else {
            this._lightboxControl.close();
        }
    }

    removeLightbox() {
        if (this._lightboxControl) {
            ReactDOM.unmountComponentAtNode(this._containerNode);

            this._lightboxControl.remove();
            this._lightboxControl = null;
        }
    }

    render() {
        return null;
    }
}

Lightbox.propTypes = {
    isOpen: PropTypes.bool,
    getOpenLink: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    title: PropTypes.string,
    width: PropTypes.number,
    children: PropTypes.node
};

Lightbox.defaultProps = {
    width: 452
};

export default Lightbox;
