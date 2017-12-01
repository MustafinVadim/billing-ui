import { expect } from "chai";
import { prepareRequestData, httpMethod } from "../../libs/axios-utils";

describe("axios utils", () => {
    describe("prepareRequestData", () => {
        const requestData = {
            some: "thing",
            another: 1
        };

        it("should wrap request data for get request", () => {
            expect(prepareRequestData(httpMethod.get, requestData).params).to.deep.equal(requestData);
        });

        it("should not wrap request data for post request", () => {
            expect(prepareRequestData(httpMethod.post, requestData)).to.deep.equal(requestData);
        });

        it("should return empty data", () => {
            expect(prepareRequestData(httpMethod.post, null)).to.be.null;
        });
    });
});
