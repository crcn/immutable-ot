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
exports.diff = function (oldItem, newItem) {
    return diff2(oldItem, newItem, [], []);
};
var diff2 = function (oldItem, newItem, path, operations) {
    if (oldItem === newItem) {
        return operations;
    }
    if (!oldItem || typeof oldItem !== "object" || oldItem.constructor !== newItem.constructor) {
        if (oldItem !== newItem) {
            operations.push(mutations_1.replace(newItem, path));
        }
    }
    else if (Array.isArray(oldItem)) {
        diffArray(oldItem, newItem, path, operations);
    }
    else if (typeof oldItem === "object") {
        diffObject(oldItem, newItem, path, operations);
    }
    return operations;
};
var diffArray = function (oldArray, newArray, path, operations) {
    var model = oldArray.concat();
    var used = {};
    var inserted = false;
    // insert, update, move
    for (var i = 0, n = newArray.length; i < n; i++) {
        var newItem = newArray[i];
        var oldItem = void 0;
        for (var j = 0, n2 = oldArray.length; j < n2; j++) {
            if (used[j]) {
                continue;
            }
            var item = oldArray[j];
            if (newItem === item) {
                oldItem = item;
                used[j] = true;
                break;
            }
        }
        if (i >= oldArray.length) {
            model.splice(i, 0, newItem);
            operations.push(mutations_1.insert(i, newItem, path));
            // does not exist
        }
        else if (oldItem == null) {
            var replItem = oldArray[i];
            var existing = void 0;
            var existingIndex = void 0;
            for (var k = i, n_1 = newArray.length; k < n_1; k++) {
                var item = newArray[k];
                if (replItem === item) {
                    existing = replItem;
                    existingIndex = k;
                    break;
                }
            }
            if (existing == null) {
                model.splice(existingIndex, 1, newItem);
                diff2(replItem, newItem, __spreadArrays(path, [i]), operations);
            }
            else {
                model.splice(i, 0, newItem);
                inserted = true;
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
            diff2(oldItem, newItem, __spreadArrays(path, [i]), operations);
        }
    }
    // delete
    var lastNewArrayIndex = newArray.length;
    for (var j = lastNewArrayIndex, length_1 = model.length; j < length_1; j++) {
        operations.push(mutations_1.remove(lastNewArrayIndex, path));
    }
    return operations;
};
var diffObject = function (oldItem, newItem, path, operations) {
    for (var key in oldItem) {
        var newValue = newItem[key];
        var oldValue = oldItem[key];
        if (typeof newValue === typeof oldValue &&
            typeof newValue === "object" &&
            newValue != null &&
            oldValue != null) {
            diff2(oldValue, newValue, __spreadArrays(path, [key]), operations);
        }
        else if (newValue == null && oldValue != null) {
            operations.push(mutations_1.unset(key, path));
        }
    }
    for (var key in newItem) {
        var newValue = newItem[key];
        if (!newItem.hasOwnProperty(key)) {
            continue;
        }
        var oldValue = oldItem[key];
        if (newValue != null &&
            newValue !== oldValue &&
            (typeof newValue !== typeof oldValue || typeof newValue !== "object")) {
            operations.push(mutations_1.set(key, newValue, path));
        }
    }
    return operations;
};
//# sourceMappingURL=diff.js.map