import { expect } from "chai";
import freeze from "deep-freeze";
import { arrayToObject, getKeysArray } from "../../helpers/StateHelper";

describe("stateHelpers", () => {
    const validInitialState = freeze([
        {
            ItemId: "ItemId1",
            Name: "Name1",
            Post: "Post1"
        },
        {
            ItemId: "ItemId2",
            Name: "Name2",
            Post: "Post2"
        }
    ]);

    describe("arrayToObject", () => {
        it("should return object of objects", () => {
            const expectedObject = {
                ItemId1: {
                    ItemId: "ItemId1",
                    Name: "Name1",
                    Post: "Post1"
                },
                ItemId2: {
                    ItemId: "ItemId2",
                    Name: "Name2",
                    Post: "Post2"
                }
            };

            const actual = arrayToObject(validInitialState, "ItemId");

            expect(actual).to.deep.equal(expectedObject);
        });

        it("should return empty object if objectsArray is null", () => {
            const actual = arrayToObject(null, "ItemId");

            expect(actual).to.deep.equal({});
        });

        it("should return empty object if keysName not passed", () => {
            const actual = arrayToObject(validInitialState);

            expect(actual).to.deep.equal({});
        });

        it("should return empty object if keysName is wrong", () => {
            const actual = arrayToObject(validInitialState, "bad");

            expect(actual).to.deep.equal({});
        });
    });

    describe("getKeysArray", () => {
        it("should return array of keys", () => {
            const expectedKeysArray = ["ItemId1", "ItemId2"];

            const actual = getKeysArray(validInitialState, "ItemId");

            expect(actual).to.deep.equal(expectedKeysArray);
        });

        it("should return empty array if objectsArray is null", () => {
            const actual = getKeysArray(null, "ItemId");

            expect(actual).to.deep.equal([]);
        });

        it("should return empty array if keysName not passed", () => {
            const actual = getKeysArray(validInitialState);

            expect(actual).to.deep.equal([]);
        });

        it("should return empty array if keysName is wrong", () => {
            const actual = getKeysArray(validInitialState, "bad");

            expect(actual).to.deep.equal([]);
        });
    });
});
