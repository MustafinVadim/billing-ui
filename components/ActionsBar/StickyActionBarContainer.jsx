import PropTypes from "prop-types";
import { PureComponent } from "react";

export const containerNodeSelector = "sticky-actionBar__container";

class StickyActionBarContainer extends PureComponent {
    render() {
        return (
            <div className={containerNodeSelector}>
                {this.props.children}
            </div>
        );
    }
}

StickyActionBarContainer.propTypes = {
    children: PropTypes.node
};

export default StickyActionBarContainer;
