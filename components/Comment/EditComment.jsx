import { PureComponent, PropTypes } from "react";
import cx from "classnames";
import axios from "../../libs/axios";
import Informer from "Informer";

import KeyCodes from "../../helpers/KeyCodes";
import TextArea from "../TextArea";
import Icon, { IconTypes } from "../Icon";
import Link from "../Link";

import { safeEncodeURI, safeDecodeURI } from "../../helpers/EncodeHelpers";

import styles from "./EditComment.scss";

class EditComment extends PureComponent {
    _textarea = null;

    state = {
        isSaving: false
    };

    componentDidMount() {
        this._focusTextarea();
    }

    _focusTextarea = () => {
        this._textarea.focus();
    };

    _canSave = () => {
        const { savedComment, unsavedText } = this.props;

        if (this.state.isSaving) {
            return false;
        }

        const trimmedInput = unsavedText ? unsavedText.trim() : "";
        const trimmedSavedComment = savedComment ? savedComment.trim() : "";

        return trimmedInput && trimmedInput !== trimmedSavedComment;
    };

    _handleKeyUp = evt => {
        if (evt.keyCode === KeyCodes.esc) {
            this.props.onCancel();
        } else if (evt.ctrlKey && evt.keyCode === KeyCodes.enter) {
            this._handleSave(evt);
        }
    };

    _handleTextChange = text => {
        const { maxLength, onTextChange } = this.props;

        let unsavedText = text;

        if (unsavedText.length > maxLength) {
            unsavedText = unsavedText.substr(0, maxLength)
        }

        onTextChange({ value: unsavedText });
    };

    _handleSave = () => {
        const { onSave, saveUrl, unsavedText } = this.props;

        if (this._canSave()) {
            this._toggleIsSaving(true);
            this._sendRequest(saveUrl, onSave, { comment: safeEncodeURI(unsavedText) }, { value: unsavedText })
        }
    };

    _handleDelete = () => {
        const { onDelete, deleteUrl } = this.props;

        this._toggleIsSaving(true);
        this._sendRequest(deleteUrl, onDelete)
    };

    _toggleIsSaving = isSaving => {
        this.setState({
            isSaving
        });
    };

    _sendRequest = (url, action, data = {}, actionData = {}) => {
        const { onError, requestData } = this.props;

        return axios
            .post(
                url,
                { ...data, ...requestData }
            )
            .then(() => {
                action({ ...actionData });
            })
            .catch(e => {
                this._toggleIsSaving(false);
                if (onError) {
                    onError(e);
                } else {
                    Informer.showError(e.message);
                }
            });
    };

    render() {
        const { savedComment, maxLength, onCancel, unsavedText, title, date } = this.props;

        const saveStyles = cx(
            styles.save,
            {
                [styles.disabled]: !this._canSave()
            }
        );

        const decodedUnsavedText = safeDecodeURI(unsavedText);

        return (
            <div>
                {(title || date) && (
                    <div className={styles.header}>
                        <div className={styles.title}>{title}</div>
                        <div className={styles.date}>{date}</div>
                    </div>
                )}
                <div className={styles.wrapper}>
                    <TextArea placeholder="Написать комментарий"
                          wrapperClassName={styles.textarea}
                          inputClassName={styles.input}
                          maxLength={maxLength}
                          width="100%"
                          value={decodedUnsavedText}
                          ref={el => { this._textarea = el } }
                          onKeyUp={this._handleKeyUp}
                          onChange={this._handleTextChange}
                          data-ft-id="comment-textarea" />

                    <div className={styles.controls}>
                        <Link className={saveStyles} onClick={this._handleSave} data-ft-id="comment-save">Сохранить</Link>
                        <Link onClick={onCancel} data-ft-id="comment-cancel">Отменить</Link>

                        {savedComment && (
                            <Link className={styles.delete} onClick={this._handleDelete} data-ft-id="comment-delete">
                                <Icon type={IconTypes.Trash} />
                                Удалить
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

EditComment.propTypes = {
    unsavedText: PropTypes.string,
    savedComment: PropTypes.string,
    maxLength: PropTypes.number.isRequired,

    title: PropTypes.string,
    date: PropTypes.string,

    saveUrl: PropTypes.string.isRequired,
    deleteUrl: PropTypes.string.isRequired,
    requestData: PropTypes.object,

    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onTextChange: PropTypes.func.isRequired
};

export default EditComment;
