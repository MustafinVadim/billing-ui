import PropTypes from "prop-types";
import { PureComponent } from "react";
import TextInput from "billing-ui/components/TextInput";
import rangeSelector from "../../helpers/SmartInputSelection";
import styles from "./TimeInput.scss";
import keyCodes from "../../helpers/KeyCodes";
import { filterObjectKeys } from "../../helpers/ArrayHelper";
import { validate } from "../../helpers/ValidationHelpers";
import { getHours, getMinutes, changeValue } from "./helpers";

const excludedInputProps = ["time", "onChangeTime", "minDate", "validationFunction"];

class TimeInput extends PureComponent {
    _selectionRanges = [{ start: 0, end: 2, type: "hours" }, { start: 3, end: 5, type: "minutes" }];
    _emptyTime = "__:__";

    _focused = false;

    handleClick = () => {
        if (this._focused) {
            this.handleSelectBlock();
        }
    };

    handleFocus = () => {
        this._focused = true;
        setTimeout(() => {
            this.handleSelectBlock();
        }, 1);
    };

    handleBlur = value => {
        const { time, onBlur, validationFunction } = this.props;
        this._focused = false;

        if (time === this._emptyTime) {
            onBlur("", {
                validationResult: {
                    isValid: true,
                    errorType: null
                }
            });
        } else if (time.indexOf("_") !== -1) {
            onBlur(time, {
                validationResult: {
                    isValid: false,
                    error: "Некорректное время"
                }
            });
        } else {
            const newTime = this._getBuildTime(time);
            onBlur(newTime, {
                validationResult: validate(newTime, validationFunction)
            })
        }
    };

    handleChange = value => {
        const { onChangeTime } = this.props;
        onChangeTime(this._getBuildTime(value));
    };

    _getBuildTime = textValue => {
        const input = this.timeInput.getDomNode();

        const [rawHours, rawMinutes] = textValue.split(":");

        return `${getHours(rawHours, input)}:${getMinutes(rawMinutes, input)}`;
    };

    _increase() {
        const { time } = this.props;

        const nextTime = changeValue(time)(1, this._selectionRanges[this._selectedBlock].type);
        this.handleChange(nextTime);
        this._selectBlock(this._selectedBlock);
    }

    _decrease() {
        const { time } = this.props;

        const prevTime = changeValue(time)(-1, this._selectionRanges[this._selectedBlock].type);
        this.handleChange(prevTime);
        this._selectBlock(this._selectedBlock);
    }

    _selectNextBlock() {
        let selectedBlock = this._selectedBlock;
        this._selectBlock(selectedBlock === this._selectionRanges.length - 1 ? selectedBlock : selectedBlock + 1);
    }

    _selectPrevBlock() {
        let selectedBlock = this._selectedBlock;
        this._selectBlock(selectedBlock === 0 ? 0 : selectedBlock - 1);
    }

    handleKey = (evt) => {
        switch (evt.keyCode) {
            case keyCodes.top:
                this._increase();
                evt.preventDefault();
                break;
            case keyCodes.bottom:
                this._decrease();
                evt.preventDefault();
                break;
            case keyCodes.left:
                this._selectPrevBlock();
                break;

            case keyCodes.space:
            case keyCodes.right:
            case keyCodes.dot:
                this._selectNextBlock();
                break;
        }
    };

    _selectBlock = blockNumber => {
        setTimeout(() => {
            rangeSelector.setSelection(this.timeInput.getDomNode(), this._selectionRanges[blockNumber]);
            this._selectedBlock = blockNumber;
        }, 1);
    }

    handleSelectBlock = () => {
        const selection = rangeSelector.getSelection(this.timeInput.getDomNode()).start;
        if (selection > this._selectionRanges[this._selectionRanges.length - 1].end) {
            this._selectBlock(0);
        } else {
            for (let i = 0; i < this._selectionRanges.length; i++) {
                if (selection <= this._selectionRanges[i].end && selection >= this._selectionRanges[i].start) {
                    if (this._selectedBlock === i) {
                        break;
                    }

                    this._selectBlock(i);
                    break;
                }
            }
        }
    }

    _getRef = input => {
        this.timeInput = input
    };

    render() {
        const { time } = this.props;
        const inputProps = filterObjectKeys({
            ...this.props
        }, excludedInputProps);
        return (
            <TextInput
                {...inputProps}
                value={time}
                placeholder={"00:00"}
                width={"100%"}
                inputClassName={styles.input}
                wrapperClassName={styles.wrapper}
                placeholderWrapperClassName={styles.placeholder}
                mask={"99:99"}
                onChange={this.handleChange}
                onClick={this.handleClick}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                ref={this._getRef}
                onKeyDown={this.handleKey}
            />
        )
    }
}

TimeInput.propTypes = {
    time: PropTypes.string,
    onChangeTime: PropTypes.func,
    onBlur: PropTypes.func,
    validationFunction: PropTypes.func
};

export default TimeInput;
