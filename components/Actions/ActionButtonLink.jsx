import { PureComponent } from "react";
import PropTypes from "prop-types";

import Link from "billing-ui/components/Link";
import SpecialCharacters from "billing-ui/helpers/SpecialCharacters";

import styles from "./ActionButtonLink.scss";

class ActionButtonLink extends PureComponent {
    render() {
        const { onClick, className } = this.props;

        return (
            <Link className={className} onMouseDown={onClick}>
                <div className={styles.dots}>
                    {SpecialCharacters.Ellipsis}
                </div>
            </Link>
        );
    }
}

ActionButtonLink.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func
};

export default ActionButtonLink;
