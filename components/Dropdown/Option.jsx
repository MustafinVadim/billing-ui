import PropTypes from "prop-types";
import { PureComponent } from "react";
import classnames from "classnames";
import optionStyles from "./Option.scss";

class Option extends PureComponent {
    handleClick = () => {
        const { disabled, onClick, value, caption } = this.props;

        if (!disabled && onClick) {
            onClick(value, caption);
        }
    }

    handleHover = () => {
        const { disabled, isSelected, onMouseOver, value } = this.props;

        if (!disabled && !isSelected && onMouseOver) {
            onMouseOver(value);
        }
    }

    render() {
        const {
            styles,
            caption,
            children,
            additionalData,
            wrapperClassName,
            captionClassName,
            isActive,
            isSelected,
            disabled,
            beforeCaption,
            title,
            optionRef,
            dataOptionId
        } = this.props;
        const wrapperClassNames = classnames(styles.option, wrapperClassName, {
            [styles.disabled]: disabled,
            [styles["as-active"]]: isActive,
            [styles["as-selected"]]: isSelected
        });
        const captionClassNames = classnames(styles.caption, captionClassName);

        return (
            <div
                className={wrapperClassNames}
                onClick={this.handleClick}
                onMouseOver={this.handleHover}
                title={title === undefined ? caption : title}
                data-ft-id="dropdown-option"
                data-option-id={dataOptionId}
                ref={optionRef}
            >
                {beforeCaption}
                <div className={captionClassNames} data-ft-id="dropdown-option-caption">{children || caption}</div>
                {additionalData && <span className={styles["additional-text"]}>{additionalData}</span>}
            </div>
        );
    }
}

Option.propTypes = {
    onMouseOver: PropTypes.func,
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
    isSelected: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    caption: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
    beforeCaption: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
    children: PropTypes.node,
    additionalData: PropTypes.string,
    wrapperClassName: PropTypes.string,
    captionClassName: PropTypes.string,
    styles: PropTypes.object,
    optionRef: PropTypes.func,
    dataOptionId: PropTypes.string
};

Option.defaultProps = {
    styles: optionStyles,
    isActive: false,
    isSelected: false
};

export default Option;
