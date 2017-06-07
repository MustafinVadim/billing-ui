import { expect } from "chai";
import GuidFactory from "../../helpers/GuidFactory";

describe("GuidFactory", () => {
    describe("create()", () => {
        it("should return Guid", () => {
            const guid = GuidFactory.create();

            expect(GuidFactory.isGuid(guid)).to.be.true;
        });
    });

    describe("empty()", () => {
        it("should return empty Guid", () => {
            expect(GuidFactory.empty()).to.equal("00000000-0000-0000-0000-000000000000");
        });
    });

    describe("createList()", () => {
        const listLength = 5;
        const list = GuidFactory.createList(listLength);

        it("should return list of Guid", () => {
            expect(list.length).to.equal(listLength);
        });

        it("list should contain valid Guids", () => {
            expect(list.every(guid => GuidFactory.isGuid(guid))).to.be.true;
        });
    });

    describe("isNullOrEmpty()", () => {
        it("should return true for empty Guid", () => {
            expect(GuidFactory.isNullOrEmpty(GuidFactory.empty())).to.be.true;
        });

        it("should return true for falsy Guid", () => {
            expect(GuidFactory.isNullOrEmpty()).to.be.true;
        });

        it("should return false for valid Guid", () => {
            expect(GuidFactory.isNullOrEmpty(GuidFactory.create())).to.be.false;
        });
    });
});
