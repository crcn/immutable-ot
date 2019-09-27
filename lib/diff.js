"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mutations_1 = require("./mutations");
exports.defaultAdapter = {
    isList: object => Array.isArray(object),
    isMap: object => object && object.constructor === Object,
    each: (object, iterate) => {
        if (Array.isArray(object)) {
            for (let i = 0, n = object.length; i < n; i++) {
                if (iterate(object[i], i) === false) {
                    break;
                }
            }
        }
        else {
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    if (iterate(object[key], key) === false) {
                        break;
                    }
                }
            }
        }
    },
    get: (object, key) => object[key],
    getListLength: (object) => object.length,
};
const DEFAULT_OPTIONS = {
    adapter: exports.defaultAdapter
};
exports.diff = (oldItem, newItem, options = DEFAULT_OPTIONS) => {
    return diff2(oldItem, newItem, [], [], options);
};
const diff2 = (oldItem, newItem, path, operations, options) => {
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
const diffArray = (oldArray, newArray, path, operations, options) => {
    const { adapter: { each, get, getListLength } } = options;
    const model = [...oldArray];
    const oldListLength = getListLength(oldArray);
    let used = {};
    each(newArray, (newItem, i) => {
        let oldItem;
        each(oldArray, (item, j) => {
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
            const replItem = get(oldArray, i);
            let existing;
            let existingIndex;
            each(newArray, (item, k) => {
                if (k < i) {
                    return;
                }
                if (replItem === item) {
                    existing = replItem;
                    existingIndex = k;
                    return false;
                }
            });
            if (existing == null) {
                model.splice(existingIndex, 1, newItem);
                diff2(replItem, newItem, [...path, i], operations, options);
            }
            else {
                model.splice(i, 0, newItem);
                operations.push(mutations_1.insert(i, newItem, path));
            }
            // exists
        }
        else {
            const oldIndex = model.indexOf(oldItem, i);
            if (oldIndex !== i) {
                model.splice(oldIndex, 1);
                model.splice(i, 0, oldItem);
                operations.push(mutations_1.move(oldIndex, i, path));
            }
            diff2(oldItem, newItem, [...path, i], operations, options);
        }
    });
    // delete
    const lastNewArrayIndex = getListLength(newArray);
    for (let j = lastNewArrayIndex, { length } = model; j < length; j++) {
        operations.push(mutations_1.remove(lastNewArrayIndex, path));
    }
    return operations;
};
const diffObject = (oldItem, newItem, path, operations, options) => {
    const { adapter: { each, get } } = options;
    each(oldItem, (oldValue, key) => {
        const newValue = get(newItem, key);
        if (typeof newValue === typeof oldValue &&
            typeof newValue === "object" &&
            newValue != null &&
            oldValue != null) {
            diff2(oldValue, newValue, [...path, key], operations, options);
        }
        else if (newValue == null && oldValue != null) {
            operations.push(mutations_1.unset(key, path));
        }
    });
    each(newItem, (newValue, key) => {
        const oldValue = get(oldItem, key);
        if (newValue != null &&
            newValue !== oldValue &&
            (typeof newValue !== typeof oldValue || typeof newValue !== "object")) {
            operations.push(mutations_1.set(key, newValue, path));
        }
    });
};
//# sourceMappingURL=diff.js.map