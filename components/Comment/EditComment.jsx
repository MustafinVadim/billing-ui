import { PureComponent, PropTypes } from "react";
import cx from "classnames";
import axios from "billing-ui/libs/axios";
import Informer from "Informer";

import KeyCodes from "billing-ui/helpers/KeyCodes";
import TextArea from "billing-ui/components/TextArea";
import Icon, { IconTypes } from "billing-ui/components/Icon";
import Link from "billing-ui/components/Link";

import { safeEncodeURI } from "../../helpers/EncodeHelpers";

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
        return axios
            .post(
                url,
                { ...data, ...this.props.requestData }
            )
            .then(() => {
                action({ ...actionData });
            })
            .catch(e => {
                this._toggleIsSaving(false);
                Informer.showError(e.message);
            });
    };

    render() {
        const { savedComment, maxLength, onCancel, unsavedText } = this.props;

        const saveStyles = cx(
            styles.save,
            {
                [styles.disabled]: !this._canSave()
            }
        );

        return (
            <div className={styles.wrapper}>
                <TextArea placeholder="Написать комментарий"
                          wrapperClassName={styles.textarea}
                          inputClassName={styles.input}
                          maxLength={maxLength}
                          width="100%"
                          value={unsavedText}
                          ref={el => { this._textarea = el } }
                          onKeyUp={this._handleKeyUp}
                          onChange={this._handleTextChange} />

                <div className={styles.controls}>
                    <Link className={saveStyles} onClick={this._handleSave}>Сохранить</Link>
                    <Link onClick={onCancel}>Отменить</Link>

                    {savedComment && (
                        <Link className={styles.delete} onClick={this._handleDelete}>
                            <Icon type={IconTypes.Trash} />
                            Удалить
                        </Link>
                    )}
                </div>
            </div>
        );
    }
}

EditComment.propTypes = {
    unsavedText: PropTypes.string,
    savedComment: PropTypes.string,
    maxLength: PropTypes.number.isRequired,

    saveUrl: PropTypes.string.isRequired,
    deleteUrl: PropTypes.string.isRequired,
    requestData: PropTypes.object,

    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onTextChange: PropTypes.func.isRequired
};

export default EditComment;
