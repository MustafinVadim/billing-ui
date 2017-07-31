import memoize from "lodash/memoize";
import has from "lodash/has";
import pick from "lodash/pick";
import filter from "lodash/filter";
import isPlainObject from "lodash/isPlainObject";

const INN_WEIGHTS = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
const LEGAL_INN_LENGTH = 10;
const INDIVIDUAL_INN_LENGTH = 12;

const DIGITS_ONLY_REGEXP = /^\d+$/;
const KPP_REGEXP = /^\d{9}$/;
const SETTLEMENT_ACCOUNT_REGEXP = /^\d{20}$/;

const EMAIL_REGEXP = /^[\wа-яА-Я\d!#$%&'*+/=?^_`}{~-]+(?:\.[\wа-яА-Я\d!#$%&'*+/=?^_`}{~-]+)*@(?:[\wа-яА-Я\d](?:[\wа-яА-Я\d-]*[\wа-яА-Я\d])?\.)+[\wа-яА-Я\d](?:[\wа-яА-Я\d-]*[\wа-яА-Я\d])$/;
// eslint-disable-next-line max-len
const EMAILS_REGEXP = /^[\W]*([\wа-яА-Я\d!#$%&'*+/=?^_`}{~-]+(?:\.[\wа-яА-Я\d!#$%&'*+/=?^_`}{~-]+)*@(?:[\wа-яА-Я\d](?:[\wа-яА-Я\d-]*[\wа-яА-Я\d])?\.)+[\wа-яА-Я\d](?:[\wа-яА-Я\d-]*[\wа-яА-Я\d])[\W]*[,;]{1}[\W]*)*([\wа-яА-Я\d!#$%&'*+/=?^_`}{~-]+(?:\.[\wа-яА-Я\d!#$%&'*+/=?^_`}{~-]+)*@(?:[\wа-яА-Я\d](?:[\wа-яА-Я\d-]*[\wа-яА-Я\d])?\.)+[\wа-яА-Я\d](?:[\wа-яА-Я\d-]*[\wа-яА-Я\d]))[\W]*$/;

const PHONE_REGEXP = /^((\+7|8)(([\s|\(|\)|\t|\n|-]*\d){10})$)|(\+7$)/;

const matchCheckSum = (innDigits, count) => {
    let sum = 0;
    const shift = 11 - count;
    for (let i = 0; i < count; i++) {
        sum += INN_WEIGHTS[shift + i] * innDigits[i];
    }
    return sum % 11 % 10 === innDigits[count];
};

const matchInnCheckSum = memoize((inn) => {
    const innDigits = Array.prototype.slice.call(inn).map(char => parseInt(char, 10));
    const isInnLegal = innDigits.length === LEGAL_INN_LENGTH;

    return isInnLegal ? matchCheckSum(innDigits, 9) : (matchCheckSum(innDigits, 10) && matchCheckSum(innDigits, 11));
});

const isValidationResult = (validationResults) => has(validationResults, "isValid");

export const isFieldValid = (validationResults) => {
    return !Object.keys(validationResults || {}).some(field => {
        if (isValidationResult(validationResults[field])) {
            return !validationResults[field].isValid;
        }

        if (Array.isArray(validationResults[field])) {
            return (validationResults[field] || []).some(validationResult => !validationResult.isValid);
        }

        if (isPlainObject(validationResults[field])) {
            return !isFieldValid(validationResults[field]);
        }
    });
};

export const isFormInvalid = (form) => {
    if (!form) {
        return false;
    }

    if (Array.isArray(form)) {
        return (form || []).some(f => isFormInvalid(f));
    }

    if (isPlainObject(form)) {
        return !isFieldValid(form.validationResult)
            || Object.keys(form || {}).some(f => isFormInvalid(form[f]));
    }

    return false;
};

export const getFormWithoutValidation = (form) => {
    return pick(form, filter(Object.keys(form || {}), field => field !== "validationResult"));
};

export const validate = (value, validateFunction) => {
    if (typeof validateFunction === "function") {
        return validateFunction(value);
    }

    if (Array.isArray(validateFunction)) {
        let validationResult;

        for (let i = 0; i < validateFunction.length; i++) {
            validationResult = validateFunction[i](value);
            if (!validationResult.isValid) {
                return validationResult;
            }
        }

        return validationResult;
    }

    throw new Error("Wrong type of validation validateFunction " + typeof validateFunction);
};

const Validation = {
    Email: (error = "Неверный формат e-mail") => (value) => {
        return {
            isValid: !value || value.trim() === "" || EMAIL_REGEXP.test(value.trim()),
            error
        };
    },

    Emails: (error = "Неверный формат e-mail") => (value) => {
        return {
            isValid: !value || value.trim() === "" || EMAILS_REGEXP.test(value),
            error
        };
    },

    Phone: (error = "Неверный формат телефона") => (value) => {
        return {
            isValid: !value || value.trim() === "" || PHONE_REGEXP.test(value),
            error
        };
    },

    Required: (error = "Поле не должно быть пустым") => (value) => {
        if (Array.isArray(value)) {
            return {
                isValid: !!value.length,
                error
            };
        }

        return {
            isValid: !!value && value.trim() !== "",
            error
        };
    },

    StringMinLength: (minLength, error = "Нужно больше символов") => (value) => {
        return {
            isValid: !value || value.length >= minLength,
            error
        };
    },

    StringMaxLength: (maxLength, error = "Превышена максимальная длина строки") => (value) => {
        return {
            isValid: !value || value.trim().length <= maxLength,
            error
        };
    },

    ArrayMaxLength: (maxLength, error = "Превышено максимальное количество элементов") => (value) => {
        return {
            isValid: !value || value.length <= maxLength,
            error
        }
    },

    Inn: (error = "Некорректный ИНН") => (value) => {
        return {
            isValid: !value
                        || value.trim() === ""
                        || ((value.length === LEGAL_INN_LENGTH || value.length === INDIVIDUAL_INN_LENGTH)
                            && DIGITS_ONLY_REGEXP.test(value)
                            && (value !== "0000000000" && value !== "000000000000")
                            && matchInnCheckSum(value)),
            error
        };
    },

    Kpp: (error = "Некорректный КПП") => (value) => {
        return {
            isValid: !value || value.trim() === "" || KPP_REGEXP.test(value),
            error
        };
    },

    SettlementAccount: (error = "Некорректный расчетный счет") => (value) => {
        return {
            isValid: !value || value.trim() === "" || SETTLEMENT_ACCOUNT_REGEXP.test(value),
            error
        };
    },

    Anything: () => () => {
        return {
            isValid: true,
            error: ""
        };
    }
};

export default Validation;
