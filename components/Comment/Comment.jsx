import PropTypes from "prop-types";
import { PureComponent } from "react";
import onClickOutside from "react-onclickoutside";
import cx from "classnames";

import { safeDecodeURI } from "../../helpers/EncodeHelpers";
import { formatDateWithTime } from "../../libs/moment";
import Icon, { IconTypes } from "../Icon";
import ReadComment from "./ReadComment.jsx";
import EditComment from "./EditComment.jsx";
import styles from "./Comment.scss";

class Comment extends PureComponent {
    _readComment = null;

    constructor(props) {
        super(props);
        this.state = {
            unsavedText: safeDecodeURI(props.value),
            isCollapsed: true,
            isEditable: false
        };
    }

    componentDidUpdate = () => {
        const { enableOnClickOutside, disableOnClickOutside } = this.props;

        if (this.state.isEditable) {
            enableOnClickOutside();
        } else {
            disableOnClickOutside();
        }
    };

    handleClickOutside = () => {
        if (this.state.unsavedText === this._getDecodedValue()) {
            this.setState({
                isEditable: false,
                isCollapsed: true
            });
        }
    };

    _handleClick = () => {
        const { readOnly } = this.props;
        const { isCollapsed, isEditable } = this.state;

        if (this._readComment && this._readComment.hasOverflow() && isCollapsed) {
            this._toggleCollapse();
        } else if (!isEditable && !readOnly) {
            this.setState({ isEditable: true });
        }
    };

    _toggleCollapse = () => {
        this.setState({ isCollapsed: !this.state.isCollapsed });
    };

    _handleSave = (data) => {
        this.props.onSave(data);
        this._completeEditing();
    };

    _handleDelete = () => {
        this.props.onDelete();
        this._completeEditing();
    };

    _handleUnsavedTextChange = ({ value }) => {
        this.setState({
            unsavedText: value
        });
    };

    _completeEditing = () => {
        this.setState({
            unsavedText: this._getDecodedValue(),
            isCollapsed: true,
            isEditable: false
        });
    };

    _getDecodedValue = () => safeDecodeURI(this.props.value);

    render() {
        const { maxLength, saveUrl, deleteUrl, requestData, commentClassName, wrapperClassName, onError, title, date, canDelete } = this.props;
        const { isEditable, isCollapsed } = this.state;

        const decodedValue = this._getDecodedValue();
        const formattedDate = date ? formatDateWithTime(date) : null;

        const wrapperClassNames = cx(
            styles.wrapper,
            wrapperClassName
        );

        const commentClassNames = cx(
            "global_comment",
            styles.comment,
            commentClassName,
            {
                [styles["editable"]]: isEditable,
                "global-is-editable": isEditable,
                [styles["empty"]]: !decodedValue
            }
        );

        return (
            <div className={wrapperClassNames}>
                <div className={commentClassNames} onClick={this._handleClick} data-ft-id="comment">
                    <Icon className={styles.icon} type={IconTypes.CommentLite} />

                    {isEditable ? (
                        <EditComment unsavedText={this.state.unsavedText}
                                     savedComment={decodedValue}
                                     title={title}
                                     date={formattedDate}
                                     saveUrl={saveUrl}
                                     deleteUrl={deleteUrl}
                                     requestData={requestData}
                                     canDelete={canDelete}
                                     onSave={this._handleSave}
                                     onCancel={this._completeEditing}
                                     onDelete={this._handleDelete}
                                     onError={onError}
                                     onTextChange={this._handleUnsavedTextChange}
                                     maxLength={maxLength}
                        />
                    ) : (
                        <ReadComment value={decodedValue}
                                     title={title}
                                     date={formattedDate}
                                     isCollapsed={isCollapsed}
                                     onCollapseToggle={this._toggleCollapse}
                                     ref={c => { this._readComment = c }} />
                    )}
                </div>
            </div>
        );
    }
}

Comment.propTypes = {
    value: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    readOnly: PropTypes.bool,
    canDelete: PropTypes.bool,
    maxLength: PropTypes.number,

    saveUrl: PropTypes.string,
    deleteUrl: PropTypes.string,
    requestData: PropTypes.object,

    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    onError: PropTypes.func,

    enableOnClickOutside: PropTypes.func,
    disableOnClickOutside: PropTypes.func,

    commentClassName: PropTypes.string,
    wrapperClassName: PropTypes.string
};

Comment.defaultProps = {
    maxLength: 2000,
    readOnly: false,
    canDelete: true,
    value: "",
    requestData: {}
};

export default onClickOutside(Comment);
