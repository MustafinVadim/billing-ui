import PropTypes from "prop-types";
import { PureComponent } from "react";
import cx from "classnames";
import Scrollbar from "../../components/Scrollbar";
import Icon, { IconTypes } from "../Icon";

import styles from "./UtilityPanel.scss";

class UtilityPanel extends PureComponent {
    _handleCloseClick = () => {
        this.props.closeClick && this.props.closeClick();
        this.props.closePortal && this.props.closePortal();
    };

    render() {
        const { title, children, canGoBack, headerAdditionalContent, wrapperClassName, bodyClassName, onScroll } = this.props;

        const wrapperClassNames = cx(
            styles.wrapper,
            wrapperClassName
        );

        const bodyClassNames = cx(
            styles.body,
            bodyClassName
        );

        return (
            <div className={wrapperClassNames} data-ft-id="utility-panel">
                <div className={styles.header}>
                    {canGoBack && (
                        <div className={styles.close} onClick={this._handleCloseClick} data-ft-id="utility-panel-close">
                            <Icon type={IconTypes.ArrowChevronLeft} />
                        </div>
                    )}
                    <span data-ft-id="utility-panel-title">{title}</span>
                    {headerAdditionalContent}
                </div>
                <Scrollbar onScroll={onScroll} containerClassName={bodyClassNames}>
                    {children}
                </Scrollbar>
            </div>
        );
    }
}

UtilityPanel.propTypes = {
    title: PropTypes.string,
    canGoBack: PropTypes.bool,
    headerAdditionalContent: PropTypes.node,
    onScroll: PropTypes.func,

    children: PropTypes.node,

    closeClick: PropTypes.func,
    closePortal: PropTypes.func, // передаётся сюда из Portal,

    wrapperClassName: PropTypes.string,
    bodyClassName: PropTypes.string
};

UtilityPanel.defaultProps = {
    canGoBack: false
};

export default UtilityPanel;
