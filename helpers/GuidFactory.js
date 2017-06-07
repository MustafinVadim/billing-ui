import uuid from "uuid";

const GuidFactory = {
    _nullGuid: "00000000-0000-0000-0000-000000000000",

    create() {
        return uuid.v4();
    },
    empty() {
        return this._nullGuid;
    },
    createList(count) {
        let guidList = [];
        for (let index = 0; index < count; index++) {
            guidList.push(this.create());
        }

        return guidList;
    },
    isNullOrEmpty(guid) {
        return !guid || guid === this._nullGuid
    },
    isGuid(guid) {
        return /^[{(]?[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}[)}]?$/ig.test(guid);
    }
};

export const createGuid = () => GuidFactory.create();
export const isNullOrEmpty = guid => GuidFactory.isNullOrEmpty(guid);
export const createGuidList = (count = 0) => GuidFactory.createList(count);
export const isGuid = guid => GuidFactory.isGuid(guid);
export const emptyGuid = () => GuidFactory.empty();

export default GuidFactory;
