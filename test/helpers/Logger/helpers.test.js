import { expect } from "chai";
import { generateAjaxErrorMessage } from "../../../helpers/Logger/helpers";

describe("logger generateAjaxErrorMessage helper", () => {
    it("should return an array", () => {
        const actual = generateAjaxErrorMessage({});
        expect(actual).to.be.instanceof(Array);
    });

    it("should generate message array", () => {
        const url = "url";
        const requestMethod = "requestMethod";
        const data = "data";
        const errorMessage = "errorMessage";

        const expected = [
            `REQUEST URL: ${url}`,
            `HTTP METHOD: ${requestMethod}`,
            `REQUEST DATA: ${data}`,
            `ERROR MESSAGE: ${errorMessage}`
        ];

        const actual = generateAjaxErrorMessage({url, requestMethod, data, errorMessage});

        expect(expected).to.deep.equal(actual);
    });
});
