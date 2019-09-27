"use strict";
/**
 */
Object.defineProperty(exports, "__esModule", { value: true });
var MutationType;
(function (MutationType) {
    MutationType[MutationType["INSERT"] = 0] = "INSERT";
    MutationType[MutationType["REMOVE"] = 1] = "REMOVE";
    MutationType[MutationType["REPLACE"] = 2] = "REPLACE";
    MutationType[MutationType["MOVE"] = 3] = "MOVE";
    MutationType[MutationType["SET"] = 4] = "SET";
    MutationType[MutationType["UNSET"] = 5] = "UNSET";
})(MutationType = exports.MutationType || (exports.MutationType = {}));
exports.remove = (index, path) => ({
    type: MutationType.REMOVE,
    index,
    path
});
exports.insert = (index, value, path) => ({
    type: MutationType.INSERT,
    index,
    value,
    path
});
exports.set = (propertyName, value, path) => ({
    type: MutationType.SET,
    propertyName,
    value,
    path
});
exports.unset = (propertyName, path) => ({
    type: MutationType.UNSET,
    propertyName,
    path
});
exports.move = (oldIndex, newIndex, path) => ({ type: MutationType.MOVE, newIndex, oldIndex, path });
exports.replace = (value, path) => ({
    type: MutationType.REPLACE,
    value,
    path
});
//# sourceMappingURL=mutations.js.map