import { PureComponent } from "react";
import PropTypes from "prop-types";
import { hasCssFeature } from "../../helpers/FeaturesDetector";
import styles from "./StickyBlock.scss";
import cx from "classnames";

class StickyBlock extends PureComponent {
    render() {
        const { children, className } = this.props;

        const hasSticky = hasCssFeature("position", "sticky");

        if (hasSticky) {
            return (
                <div className={cx(styles.sticky, className)}>
                    {children}
                </div>
            );
        }

        return (
            <div className={className}>
                {children}
            </div>
        );
    }
}

StickyBlock.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    scrollContainer: PropTypes.string
};

export default StickyBlock;
