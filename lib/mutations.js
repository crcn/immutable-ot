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
exports.remove = function (index, path) { return ({
    type: MutationType.REMOVE,
    index: index,
    path: path
}); };
exports.insert = function (index, value, path) { return ({
    type: MutationType.INSERT,
    index: index,
    value: value,
    path: path
}); };
exports.set = function (propertyName, value, path) { return ({
    type: MutationType.SET,
    propertyName: propertyName,
    value: value,
    path: path
}); };
exports.unset = function (propertyName, path) { return ({
    type: MutationType.UNSET,
    propertyName: propertyName,
    path: path
}); };
exports.move = function (oldIndex, newIndex, path) { return ({ type: MutationType.MOVE, newIndex: newIndex, oldIndex: oldIndex, path: path }); };
exports.replace = function (value, path) { return ({
    type: MutationType.REPLACE,
    value: value,
    path: path
}); };
//# sourceMappingURL=mutations.js.map