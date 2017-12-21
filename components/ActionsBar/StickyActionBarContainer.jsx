import PropTypes from "prop-types";
import { PureComponent } from "react";

export const CONTAINER_NODE_SELECTOR = "sticky-actionBar__container";

class StickyActionBarContainer extends PureComponent {
    render() {
        return (
            <div className={CONTAINER_NODE_SELECTOR}>
                {this.props.children}
            </div>
        );
    }
}

StickyActionBarContainer.propTypes = {
    children: PropTypes.node
};

export default StickyActionBarContainer;
