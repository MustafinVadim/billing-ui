import PropTypes from "prop-types";
import { PureComponent } from "react";
import SpecialCharacters from "../../helpers/SpecialCharacters";
import Popup from "../PopupWrapper";

import styles from "./Actions.scss";
import cx from "classnames";

class Actions extends PureComponent {
    _closeLink = null;

    constructor(props) {
        super(props);

        this.state = {
            isActive: props.isActive
        };
    }

    componendDidUpdate() {
        this.setState({
            isActive: this.props.isActive
        });
    }

    _handleClickContent = () => {
        const { shouldCloseOnClick } = this.props;

        if (shouldCloseOnClick) {
            this.setState({
                isActive: false
            });
        }
    };

    render() {
        const { className, children, getBindItem, position, onOpen, onClose, ellipsisClassName } = this.props;
        const { isActive } = this.state;
        const classNamesPopup = cx(styles.popup, className);
        const ellipsisClassNames = cx(styles["close-link"], ellipsisClassName);

        return (
            <Popup className={classNamesPopup}
                   position={position}
                   getBindItem={getBindItem}
                   getOpenLink={getBindItem}
                   getCloseLink={() => this._closeLink}
                   onOpen={onOpen}
                   onClose={onClose}
                   isActive={isActive}
            >
                <div onClick={this._handleClickContent}>
                    <span className={ellipsisClassNames} ref={node => {
                        this._closeLink = node
                    }}>
                        {SpecialCharacters.Ellipsis}
                    </span>
                    {children}
                </div>
            </Popup>
        );
    }
}

Actions.propTypes = {
    onOpen: PropTypes.func,
    onClose: PropTypes.func,

    isActive: PropTypes.bool,
    position: PropTypes.object,
    getBindItem: PropTypes.func.isRequired,
    shouldCloseOnClick: PropTypes.bool,

    className: PropTypes.string,
    ellipsisClassName: PropTypes.string,
    children: PropTypes.node
};

Actions.defaultProps = {
    position: { top: 0, right: 0 },
    className: "",
    closeOnAction: false
};

export default Actions;
