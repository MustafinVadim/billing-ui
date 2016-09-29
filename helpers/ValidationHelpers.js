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
        const re = /^[\W]*([a-zA-Zа-яА-Я+\-.%]+@[a-zA-Zа-яА-Я\-.]+\.[a-zA-Zа-яА-Я]{2,4}[\W]*[,;]{1}[\W]*)*([a-zA-Zа-яА-Я+\-.%]+@[a-zA-Zа-яА-Я\-.]+\.[a-zA-Zа-яА-Я]{2,4})[\W]*$/;

        return {
            isValid: re.test(value),
            error
        };
    },

    Required: (error = "Поле не должно быть пустым") => (value) => {
        return {
            isValid: value.trim() !== "",
            error
        };
    },

    Kpp: (error = "Некорректный КПП") => (value) => {
        const re = /^(\d{9})?$/;

        return {
            isValid: re.test(value),
            error
        };
    },

    SettlementAccount: (error = "Некорректный расчетный счет") => (value) => {
        const re = /^(\d{20})?$/;

        return {
            isValid: re.test(value),
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
