import PropTypes from "prop-types";
import { PureComponent } from "react";
import TextInput from "billing-ui/components/TextInput";
import rangeSelector from "../../helpers/SmartInputSelection";
import styles from "./TimeInput.scss";
import keyCodes from "../../helpers/KeyCodes";
import validationErrorType from "./ValidationErrorType";
import CustomPropTypes from "../../helpers/CustomPropTypes";
import moment, { convertString, convertISOString } from "../../libs/moment";
import { filterObjectKeys } from "../../helpers/ArrayHelper";
import { getTimeFromDate } from "../../helpers/DateHelper";

const excludedInputProps = ["time", "changeTime", "minDate", "date"];

class TimeInput extends PureComponent {
    _selectionRanges = [{ start: 0, end: 2, type: "hours" }, { start: 3, end: 5, type: "minutes" }];
    _emptyTime = "__:__";

    _focused = false;

    componentDidMount() {
        const { changeTime, time, date } = this.props;
        changeTime(getTimeFromDate(date, time));
    }

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

    handleBlur = () => {
        const { time, changeTime } = this.props;
        this._focused = false;

        if (time === this._emptyTime) {
            changeTime("");
        } else if (time.indexOf("_") !== -1) {
            changeTime(time, {
                isValid: false,
                errorType: validationErrorType.unfilledDate
            });
        } else {
            this.changeTime(time);
        }
    };

    validate(time, minDate = this.props.minDate, maxDate = this.props.maxDate) {
        const { date } = this.props;
        const dateWithTime = convertISOString(`${date.split("T")[0]}T${time._i}:00`);

        if (minDate && dateWithTime.isBefore(convertISOString(minDate))) {
            return {
                isValid: false,
                errorType: validationErrorType.minTimeExceed
            }
        }

        if (maxDate && dateWithTime.isAfter(convertISOString(maxDate))) {
            return {
                isValid: false,
                errorType: validationErrorType.maxDateExceed
            }
        }

        return {
            isValid: true,
            errorType: null
        }
    }

    handleChange = textValue => {
        this.changeTime(convertString(textValue, "HH:mm"));
    };

    changeTime = data => {
        const { changeTime } = this.props;
        const rawTime = data.format().split("T")[1] || convertISOString(data || this._emptyTime)._i;
        const input = this.timeInput._inputDom;
        const setCursorTo = (input, end) => {
            setTimeout(() => {
                input.selectionStart = input.selectionEnd = end;
            }, 30);
        };

        const [rawHours, rawMinutes] = rawTime.split(":").slice(0, 2);

        const toArr = string => {
            if (!string) {
                return [0, 0];
            }
            return string.split("").map(el => parseInt(el)).filter(el => !isNaN(el));
        };

        const hours = hrs => {
            const hoursArr = toArr(hrs);
            if (hoursArr[0] > 2) {
                setCursorTo(input, 3);
                return [0, hoursArr[0]].join("");
            }

            if (hoursArr[0] === 2 && hoursArr[1] > 3) {
                return "23";
            }
            return hrs;
        }

        const minutes = mins => {
            const minutesArr = toArr(mins);
            if (minutesArr[0] > 5) {
                setCursorTo(input, 5);
                return [0, minutesArr[0]].join("");
            }
            return mins;
        }

        const time = `${hours(rawHours)}:${minutes(rawMinutes)}`;
        const convertedTime = convertISOString(convertString(time, "HH:mm"));

        const { isValid, errorType } = this.validate(convertedTime);
        changeTime(time, {
            isValid,
            errorType
        });
    };

    _increase() {
        const { time } = this.props;
        const isoTime = convertISOString(convertString(time, "HH:mm"));
        const nextTime = moment(isoTime).add(1, this._selectionRanges[this._selectedBlock].type);
        this.changeTime(nextTime);
        this._selectBlock(this._selectedBlock);
    }

    _decrease() {
        const { time } = this.props;
        const isoTime = convertISOString(convertString(time, "HH:mm"));
        const prevTime = moment(isoTime).subtract(1, this._selectionRanges[this._selectedBlock].type);
        this.changeTime(prevTime);
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
        }, 0);
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

    _getRef = input => { this.timeInput = input };


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
    changeTime: PropTypes.func,
    minDate: CustomPropTypes.date,
    maxDate: CustomPropTypes.date,
    date: CustomPropTypes.date
};

export default TimeInput;