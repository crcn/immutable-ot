"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mutations_1 = require("./mutations");
exports.defaultAdapter = {
    isList: object => Array.isArray(object),
    isMap: object => object && object.constructor === Object,
    equals: (a, b) => a === b,
    diffable: (a, b) => true,
    typeEquals: (a, b) => typeof a === typeof b,
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
const typeEquals = (oldItem, newItem, options) => oldItem && typeof oldItem === "object" && oldItem.constructor == newItem.constructor && options.adapter.typeEquals(oldItem, newItem);
const diff2 = (oldItem, newItem, path, operations, options) => {
    if (oldItem === newItem) {
        return operations;
    }
    if (!typeEquals(oldItem, newItem, options)) {
        if (oldItem !== newItem) {
            operations.push(mutations_1.replace(newItem, path));
        }
    }
    else if (options.adapter.isList(oldItem)) {
        diffArray2(oldItem, newItem, path, operations, options);
    }
    else if (options.adapter.isMap(oldItem)) {
        diffObject(oldItem, newItem, path, operations, options);
    }
    return operations;
};
const diffArray2 = (oldArray, newArray, path, mutations, options) => {
    const { adapter: { each, get, getListLength, equals, diffable } } = options;
    // model used to figure out the proper mutation indices
    const model = [...oldArray];
    // remaining old values to be matched with new values. Remainders get deleted.
    const oldPool = [...oldArray];
    // remaining new values. Remainders get inserted.
    const newPool = [...newArray];
    let matches = [];
    for (let i = 0, n = oldPool.length; i < n; i++) {
        const oldValue = oldPool[i];
        let bestNewValue;
        let fewestDiffCount = Infinity;
        // there may be multiple matches, so look for the best one
        for (let j = 0, n2 = newPool.length; j < n2; j++) {
            const newValue = newPool[j];
            if (equals(oldValue, newValue)) {
                bestNewValue = newValue;
                break;
            }
        }
        // subtract matches from both old & new pools and store
        // them for later use
        if (bestNewValue != null) {
            oldPool.splice(i--, 1);
            n--;
            newPool.splice(newPool.indexOf(bestNewValue), 1);
            // need to manually set array indice here to ensure that the order
            // of operations is correct when mutating the target array.
            matches[newArray.indexOf(bestNewValue)] = [oldValue, bestNewValue];
        }
    }
    for (let i = oldPool.length; i--;) {
        const oldValue = oldPool[i];
        const index = oldArray.indexOf(oldValue);
        mutations.push(mutations_1.remove(index, path));
        model.splice(index, 1);
    }
    // sneak the inserts into the matches so that they're
    // ordered propertly along with the updates - particularly moves.
    for (let i = 0, n = newPool.length; i < n; i++) {
        const newValue = newPool[i];
        const index = newArray.indexOf(newValue);
        matches[index] = [undefined, newValue];
    }
    // apply updates last using indicies from the old array model. This ensures
    // that mutations are properly applied to whatever target array.
    for (let i = 0, n = matches.length; i < n; i++) {
        const match = matches[i];
        // there will be empty values since we're manually setting indices on the array above
        if (match == null)
            continue;
        const [oldValue, newValue] = matches[i];
        const newIndex = i;
        // insert
        if (oldValue == null) {
            mutations.push(mutations_1.insert(newIndex, newValue, path));
            model.splice(newIndex, 0, newValue);
            // updated
        }
        else {
            const oldIndex = model.indexOf(oldValue);
            if (oldIndex !== newIndex) {
                model.splice(oldIndex, 1);
                model.splice(newIndex, 0, oldValue);
                mutations.push(mutations_1.move(oldIndex, newIndex, path));
            }
            diff2(oldValue, newValue, [...path, newIndex], mutations, options);
        }
    }
};
const diffArray = (oldArray, newArray, path, operations, options) => {
    const { adapter: { each, get, getListLength, equals, diffable } } = options;
    const model = [...oldArray];
    const oldListLength = getListLength(oldArray);
    let used = {};
    each(newArray, (newItem, i) => {
        let oldItem;
        each(oldArray, (item, j) => {
            if (used[j]) {
                return;
            }
            if (equals(newItem, item)) {
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
                if (equals(replItem, item)) {
                    existing = replItem;
                    existingIndex = k;
                    return false;
                }
            });
            if (existing == null) {
                model.splice(existingIndex, 1, newItem);
                if (typeEquals(replItem, newItem, options) && diffable(replItem, newItem)) {
                    diff2(replItem, newItem, [...path, i], operations, options);
                }
                else {
                    operations.push(mutations_1.remove(i, path));
                    operations.push(mutations_1.insert(i, newItem, path));
                }
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