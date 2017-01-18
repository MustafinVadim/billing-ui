import { expect } from "chai";
import freeze from "deep-freeze";
import Validation, { getFormWithoutValidation, isFieldValid, isFormInvalid } from "../../helpers/ValidationHelpers";

describe("ValidationHelpers", () => {
    const commonErrorMessage = "hello world";
    const DEFAULT_VALIDATION_RESULT = { isValid: true, error: "" };

    describe("getFormWithoutValidation", () => {
        it("должен врернуть форму, в которой будет убран объект validationResult", () => {
            const form = freeze({
                Fio: "Fio",
                Post: "Post",
                Emails: ["Emails@gmail.com"],
                validationResult: {
                    Post: DEFAULT_VALIDATION_RESULT
                }
            });
            expect(form.validationResult).to.exist;

            const formWithoutValidation = getFormWithoutValidation(form);

            expect(formWithoutValidation.validationResult).to.not.exist;
        });
    });

    describe("isFieldValid", () => {
        it("Должен вернуть true - т.к. все поля валидные на линейной форме", () => {
            const validationResults = freeze({
                Fio: DEFAULT_VALIDATION_RESULT,
                Post: DEFAULT_VALIDATION_RESULT
            });

            const isValidForm = isFieldValid(validationResults);

            expect(isValidForm).to.be.true;
        });

        it("Должен вернуть false - т.к. есть невалидное поле на линейной форме", () => {
            const validationResults = freeze({
                Fio: DEFAULT_VALIDATION_RESULT,
                ProductId: DEFAULT_VALIDATION_RESULT,
                Contact: {
                    Fio: DEFAULT_VALIDATION_RESULT,
                    Post: DEFAULT_VALIDATION_RESULT,
                    Emails: {
                        Emails1: DEFAULT_VALIDATION_RESULT,
                        Emails2: DEFAULT_VALIDATION_RESULT
                    },
                    Phones: {
                        Phones1: DEFAULT_VALIDATION_RESULT,
                        Phones2: DEFAULT_VALIDATION_RESULT
                    }
                },
                Post: { isValid: false, error: "Длина не должны превышать 255 символов" }
            });

            const isValidForm = isFieldValid(validationResults);

            expect(isValidForm).to.be.false;
        });

        it("Должен вернуть true - т.к. все поля валидные во вложенной валидации (проверка прохода по массиву)", () => {
            const validationResults = freeze({
                Fio: DEFAULT_VALIDATION_RESULT,
                Post: DEFAULT_VALIDATION_RESULT,
                Emails: [
                    DEFAULT_VALIDATION_RESULT,
                    DEFAULT_VALIDATION_RESULT
                ]
            });

            const isValidForm = isFieldValid(validationResults);

            expect(isValidForm).to.be.true;
        });

        it("Должен вернуть false - т.к. есть невалидное поле во вложенной валидации (проверка прохода по массиву)", () => {
            const validationResults = freeze({
                Fio: DEFAULT_VALIDATION_RESULT,
                Post: DEFAULT_VALIDATION_RESULT,
                Emails: [
                    DEFAULT_VALIDATION_RESULT,
                    DEFAULT_VALIDATION_RESULT,
                    { isValid: false, error: "Не валидный e-mail" }
                ]
            });

            const isValidForm = isFieldValid(validationResults);

            expect(isValidForm).to.be.false;
        });

        it("Должен вернуть true - т.к. все поля валидные во вложенной валидации (проверка прохода по объекту)", () => {
            const validationResults = freeze({
                Fio: DEFAULT_VALIDATION_RESULT,
                Post: DEFAULT_VALIDATION_RESULT,
                Emails: {
                    Emails1: DEFAULT_VALIDATION_RESULT,
                    Emails2: DEFAULT_VALIDATION_RESULT
                }
            });

            const isValidForm = isFieldValid(validationResults);

            expect(isValidForm).to.be.true;
        });

        it("Должен вернуть false - т.к. есть невалидное поле во вложенной валидации (проверка прохода по объекту)", () => {
            const validationResults = freeze({
                ProductId: DEFAULT_VALIDATION_RESULT,
                Contact: {
                    Fio: DEFAULT_VALIDATION_RESULT,
                    Post: DEFAULT_VALIDATION_RESULT,
                    Emails: {
                        Emails1: DEFAULT_VALIDATION_RESULT,
                        Emails2: DEFAULT_VALIDATION_RESULT
                    },
                    Phones: {
                        Phones1: DEFAULT_VALIDATION_RESULT,
                        Phones2: { isValid: false, error: "Не валидный телефон" }
                    }
                }
            });

            const isValidForm = isFieldValid(validationResults);

            expect(isValidForm).to.be.false;
        });
    });

    describe("isFormInvalid", () => {
        it("Должен вернуть false - т.к. не передали форму)", () => {
            const hasIsInvalidFields = isFormInvalid();

            expect(hasIsInvalidFields).to.be.false;
        });

        it("Должен вернуть false - т.к. передали вместо формы - строку", () => {
            const hasIsInvalidFields = isFormInvalid("form");

            expect(hasIsInvalidFields).to.be.false;
        });

        it("Должен вернуть false - т.к. все поля формы (в линейной реализации) - валидные", () => {
            const form = freeze({
                ProductId: "ProductId",
                Temperature: "Temperature",
                Manager: "Manager",
                validationResult: {
                    ProductId: DEFAULT_VALIDATION_RESULT,
                    Temperature: DEFAULT_VALIDATION_RESULT,
                    Manager: DEFAULT_VALIDATION_RESULT
                }
            });

            const hasIsInvalidFields = isFormInvalid(form);

            expect(hasIsInvalidFields).to.be.false;
        });

        it("Должен вернуть true - т.к. есть невалидное поле", () => {
            const form = freeze({
                ProductId: "",
                Temperature: "Temperature",
                Manager: "Manager",
                validationResult: {
                    ProductId: { isValid: false, error: "Продукт обязателен для заполнения" },
                    Temperature: DEFAULT_VALIDATION_RESULT,
                    Manager: DEFAULT_VALIDATION_RESULT
                }
            });

            const hasIsInvalidFields = isFormInvalid(form);

            expect(hasIsInvalidFields).to.be.true;
        });

        it("Должен вернуть true - т.к. есть невалиднное поле во вложенной форме", () => {
            const form = freeze({
                ProductId: "ProductId",
                Temperature: "Temperature",
                Manager: "Manager",
                Phones: [
                    {
                        Number: "89827978887",
                        validationResult: {
                            Number: DEFAULT_VALIDATION_RESULT
                        }
                    },
                    {
                        Number: "878",
                        validationResult: {
                            Number: { isValid: false, error: "Телефон должен быть валидным" }
                        }
                    }
                ],
                validationResult: {
                    ProductId: DEFAULT_VALIDATION_RESULT,
                    Temperature: DEFAULT_VALIDATION_RESULT,
                    Manager: DEFAULT_VALIDATION_RESULT
                }
            });

            const hasIsInvalidFields = isFormInvalid(form);

            expect(hasIsInvalidFields).to.be.true;
        });

        it("Должен вернуть true - т.к. есть невалидное поле во вложенной форме (проверка прохода по массиву)", () => {
            const form = freeze({
                ProductId: "ProductId",
                Temperature: "Temperature",
                Manager: "Manager",
                Phones: [
                    {
                        Number: "89827978887",
                        validationResult: {
                            Number: DEFAULT_VALIDATION_RESULT
                        }
                    },
                    {
                        Number: "878",
                        validationResult: {
                            Number: { isValid: false, error: "Телефон должен быть валидным" }
                        }
                    }
                ],
                validationResult: {
                    ProductId: DEFAULT_VALIDATION_RESULT,
                    Temperature: DEFAULT_VALIDATION_RESULT,
                    Manager: DEFAULT_VALIDATION_RESULT
                }
            });

            const hasIsInvalidFields = isFormInvalid(form.Phones);

            expect(hasIsInvalidFields).to.be.true;
        });

        it("Должен вернуть false - т.к. все поля валидные (проверка прохода по массиву)", () => {
            const form = freeze({
                ProductId: "ProductId",
                Temperature: "Temperature",
                Manager: "Manager",
                Phones: [
                    {
                        Number: "89827978887",
                        validationResult: {
                            Number: DEFAULT_VALIDATION_RESULT
                        }
                    },
                    {
                        Number: "878",
                        validationResult: {
                            Number: DEFAULT_VALIDATION_RESULT
                        }
                    }
                ],
                validationResult: {
                    ProductId: DEFAULT_VALIDATION_RESULT,
                    Temperature: DEFAULT_VALIDATION_RESULT,
                    Manager: DEFAULT_VALIDATION_RESULT
                }
            });

            const hasIsInvalidFields = isFormInvalid(form.Phones);

            expect(hasIsInvalidFields).to.be.false;
        });
    });

    describe("Email", () => {
        it("should set passed error message", () => {
            expect(Validation.Email(commonErrorMessage)("").error).to.equal(commonErrorMessage);
        });

        it("should set isValid = true", () => {
            expect(Validation.Email()("").isValid).to.be.true;
            expect(Validation.Email()("emailWithNumb3rs@example.com").isValid).to.be.true;
            expect(Validation.Email()("Кириллический@Домен.рф").isValid).to.be.true;
        });

        it("should set isValid = false", () => {
            expect(Validation.Email()("hello%bad@email#yep").isValid).to.be.false;
        });
    });

    describe("Phone", () => {
        it("should set passed error message", () => {
            expect(Validation.Phone(commonErrorMessage)("").error).to.equal(commonErrorMessage);
        });

        it("should set isValid = true", () => {
            expect(Validation.Phone()("").isValid).to.be.true;
            expect(Validation.Phone()("+7 950 11-11-111").isValid).to.be.true;
            expect(Validation.Phone()("8 (343) 310 10 10").isValid).to.be.true;
        });

        it("should set isValid = false", () => {
            expect(Validation.Phone()("+7 95O 11-11-111").isValid).to.be.false;
        });
    });

    describe("Required", () => {
        it("should set passed error message", () => {
            expect(Validation.Required(commonErrorMessage)("").error).to.equal(commonErrorMessage);
        });

        it("should set isValid = true", () => {
            expect(Validation.Required()(commonErrorMessage).isValid).to.be.true;
        });

        it("should set isValid = false", () => {
            expect(Validation.Required()("").isValid).to.be.false;
        });
    });

    describe("StringMinLength", () => {
        it("should set passed error message", () => {
            expect(Validation.StringMinLength(2, commonErrorMessage)("").error).to.equal(commonErrorMessage);
        });

        it("should set isValid = true", () => {
            expect(Validation.StringMinLength(2)(commonErrorMessage).isValid).to.be.true;
        });

        it("should set isValid = false", () => {
            expect(Validation.StringMinLength(50)(commonErrorMessage).isValid).to.be.false;
        });
    });

    describe("StringMaxLength", () => {
        it("should set passed error message", () => {
            expect(Validation.StringMaxLength(2, commonErrorMessage)("").error).to.equal(commonErrorMessage);
        });

        it("should set isValid = true", () => {
            expect(Validation.StringMaxLength(50)(commonErrorMessage).isValid).to.be.true;
        });

        it("should set isValid = false", () => {
            expect(Validation.StringMaxLength(5)(commonErrorMessage).isValid).to.be.false;
        });
    });

    describe("Kpp", () => {
        it("should set passed error message", () => {
            expect(Validation.Kpp(commonErrorMessage)("").error).to.equal(commonErrorMessage);
        });

        it("should set isValid = true", () => {
            expect(Validation.Kpp()("").isValid).to.be.true;
            expect(Validation.Kpp()("123456789").isValid).to.be.true;
        });

        it("should set isValid = false", () => {
            expect(Validation.Kpp()("123").isValid).to.be.false;
        });
    });

    describe("SettlementAccount", () => {
        it("should set passed error message", () => {
            expect(Validation.SettlementAccount(commonErrorMessage)("").error).to.equal(commonErrorMessage);
        });

        it("should set isValid = true", () => {
            expect(Validation.SettlementAccount()("").isValid).to.be.true;
            expect(Validation.SettlementAccount()("12345678901234567890").isValid).to.be.true;
        });

        it("should set isValid = false", () => {
            expect(Validation.SettlementAccount()("123").isValid).to.be.false;
        });
    });

    describe("Anything", () => {
        it("should set isValid = true", () => {
            expect(Validation.Anything()("").isValid).to.be.true;
            expect(Validation.Anything()("123").isValid).to.be.true;
            expect(Validation.Anything()("abc").isValid).to.be.true;
        });
    });
});
