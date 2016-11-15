import { PureComponent, PropTypes } from "react";
import cx from "classnames";
import Icon, { IconTypes } from "../Icon";

import styles from "./UtilityPanel.scss";

class UtilityPanel extends PureComponent {
    _handleCloseClick = () => {
        this.props.closeClick && this.props.closeClick();
        this.props.closePortal && this.props.closePortal();
    };

    render() {
        const { title, children, className, canGoBack, headerContent } = this.props;

        const utilityPanelClassNames = cx(
            styles.container,
            className
        );

        return (
            <div className={utilityPanelClassNames} data-ft-id="utility-panel">
                <div className={styles.header}>
                    {canGoBack && (
                        <div className={styles.close} onClick={this._handleCloseClick} data-ft-id="utility-panel-close">
                            <Icon type={IconTypes.ArrowChevronLeft} />
                        </div>
                    )}
                    <span data-ft-id="utility-panel-title">{title}</span>
                    {headerContent}
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        );
    }
}

UtilityPanel.propTypes = {
    title: PropTypes.string,
    canGoBack: PropTypes.bool,
    headerContent: PropTypes.node,
    children: PropTypes.node,
    closeClick: PropTypes.func,
    closePortal: PropTypes.func, // передаётся сюда из Portal,
    className: PropTypes.string
};

UtilityPanel.defaultProps = {
    canGoBack: false
};

export default UtilityPanel;
