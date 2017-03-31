import { PureComponent, PropTypes, Children, cloneElement } from "react";

import CustomPropTypes from "billing-ui/helpers/CustomPropTypes";
import Tab from "./Tab";

import styles from "./Tabs.scss";
import cx from "classnames";

class Tabs extends PureComponent {
    _handleTabClick = (evt) => {
        this.props.onChange({ tab: evt.target.getAttribute("name") });
    };

    _renderContent() {
        const { activeTab, children } = this.props;

        return Children.map(children, (tab, index) => {
            if (tab.props.tab !== activeTab) {
                return;
            }

            return cloneElement(tab || {}, { key: `${tab.props.tab}-${index}` })
        });
    }

    render() {
        const { wrapperClassNames, tabs, tabClassNames, headerClassNames, activeTab, ftId } = this.props;

        return (
            <div className={wrapperClassNames} data-ft-id={ftId}>
                <div className={cx(styles.header, headerClassNames)}>
                    {tabs.map(({ tab, title }) => (
                        <span className={cx(styles.tab, tabClassNames, { [styles.active]: activeTab === tab })}
                            name={tab}
                            key={`${tab}-tab-button`}
                            data-ft-id={`${tab}-tab-button`}
                            onClick={this._handleTabClick}
                        >
                            {title}
                        </span>
                    ))}
                </div>
                <div className={styles.content}>
                    {this._renderContent()}
                </div>
            </div>
        );
    }
}

Tabs.propTypes = {
    ftId: PropTypes.string,
    wrapperClassNames: PropTypes.string,
    headerClassNames: PropTypes.string,
    tabClassNames: PropTypes.string,
    activeTab: PropTypes.string.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        tab: PropTypes.string,
        title: PropTypes.string
    })),
    onChange: PropTypes.func,
    children: CustomPropTypes.children(Tab)
};

export default Tabs;
