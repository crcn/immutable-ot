"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mutations_1 = require("./mutations");
exports.defaultAdapter = {
    isList: function (object) { return Array.isArray(object); },
    isMap: function (object) { return object && object.constructor === Object; },
    each: function (object, iterate) {
        if (Array.isArray(object)) {
            for (var i = 0, n = object.length; i < n; i++) {
                if (iterate(object[i], i) === false) {
                    break;
                }
            }
        }
        else {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    if (iterate(object[key], key) === false) {
                        break;
                    }
                }
            }
        }
    },
    get: function (object, key) { return object[key]; },
    getListLength: function (object) { return object.length; },
};
var DEFAULT_OPTIONS = {
    adapter: exports.defaultAdapter
};
exports.diff = function (oldItem, newItem, options) {
    if (options === void 0) { options = DEFAULT_OPTIONS; }
    return diff2(oldItem, newItem, [], [], options);
};
var diff2 = function (oldItem, newItem, path, operations, options) {
    if (oldItem === newItem) {
        return operations;
    }
    if (!oldItem || typeof oldItem !== "object" || oldItem.constructor !== newItem.constructor) {
        if (oldItem !== newItem) {
            operations.push(mutations_1.replace(newItem, path));
        }
    }
    else if (options.adapter.isList(oldItem)) {
        diffArray(oldItem, newItem, path, operations, options);
    }
    else if (options.adapter.isMap(oldItem)) {
        diffObject(oldItem, newItem, path, operations, options);
    }
    return operations;
};
var diffArray = function (oldArray, newArray, path, operations, options) {
    var _a = options.adapter, each = _a.each, get = _a.get, getListLength = _a.getListLength;
    var model = __spreadArrays(oldArray);
    var oldListLength = getListLength(oldArray);
    var used = {};
    each(newArray, function (newItem, i) {
        var oldItem;
        each(oldArray, function (item, j) {
            if (used[j]) {
                return;
            }
            if (newItem === item) {
                oldItem = item;
                used[j] = true;
                return false;
            }
        });
        if (i >= oldListLength) {
            model.splice(i, 0, newItem);
            operations.push(mutations_1.insert(i, newItem, path));
            // does not exist
        }
        else if (oldItem == null) {
            var replItem_1 = get(oldArray, i);
            var existing_1;
            var existingIndex_1;
            each(newArray, function (item, k) {
                if (k < i) {
                    return;
                }
                if (replItem_1 === item) {
                    existing_1 = replItem_1;
                    existingIndex_1 = k;
                    return false;
                }
            });
            if (existing_1 == null) {
                model.splice(existingIndex_1, 1, newItem);
                diff2(replItem_1, newItem, __spreadArrays(path, [i]), operations, options);
            }
            else {
                model.splice(i, 0, newItem);
                operations.push(mutations_1.insert(i, newItem, path));
            }
            // exists
        }
        else {
            var oldIndex = model.indexOf(oldItem, i);
            if (oldIndex !== i) {
                model.splice(oldIndex, 1);
                model.splice(i, 0, oldItem);
                operations.push(mutations_1.move(oldIndex, i, path));
            }
            diff2(oldItem, newItem, __spreadArrays(path, [i]), operations, options);
        }
    });
    // delete
    var lastNewArrayIndex = getListLength(newArray);
    for (var j = lastNewArrayIndex, length_1 = model.length; j < length_1; j++) {
        operations.push(mutations_1.remove(lastNewArrayIndex, path));
    }
    return operations;
};
var diffObject = function (oldItem, newItem, path, operations, options) {
    var _a = options.adapter, each = _a.each, get = _a.get;
    each(oldItem, function (oldValue, key) {
        var newValue = get(newItem, key);
        if (typeof newValue === typeof oldValue &&
            typeof newValue === "object" &&
            newValue != null &&
            oldValue != null) {
            diff2(oldValue, newValue, __spreadArrays(path, [key]), operations, options);
        }
        else if (newValue == null && oldValue != null) {
            operations.push(mutations_1.unset(key, path));
        }
    });
    each(newItem, function (newValue, key) {
        var oldValue = get(oldItem, key);
        if (newValue != null &&
            newValue !== oldValue &&
            (typeof newValue !== typeof oldValue || typeof newValue !== "object")) {
            operations.push(mutations_1.set(key, newValue, path));
        }
    });
};
//# sourceMappingURL=diff.js.map