"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mutations_1 = require("./mutations");
const utils_1 = require("./utils");
const defaultPatchAdapter = {
    getDeepValue: utils_1.getValue,
    setDeepValue: utils_1.setValue,
};
exports.patch = (oldValue, mutations, { getDeepValue, setDeepValue } = defaultPatchAdapter) => {
    let newValue = oldValue;
    for (let i = 0, n = mutations.length; i < n; i++) {
        const mutation = mutations[i];
        let target = getDeepValue(newValue, mutation.path);
        switch (mutation.type) {
            case mutations_1.MutationType.INSERT: {
                target = utils_1.arraySplice(target, mutation.index, 0, mutation.value);
                break;
            }
            case mutations_1.MutationType.REMOVE: {
                target = utils_1.arraySplice(target, mutation.index, 1);
                break;
            }
            case mutations_1.MutationType.REPLACE: {
                target = mutation.value;
                break;
            }
            case mutations_1.MutationType.MOVE: {
                const value = target[mutation.oldIndex];
                target = utils_1.arraySplice(target, mutation.oldIndex, 1);
                target = utils_1.arraySplice(target, mutation.newIndex, 0, value);
                break;
            }
            case mutations_1.MutationType.SET: {
                target = Object.assign(Object.assign({}, target), { [mutation.propertyName]: mutation.value });
                break;
            }
            case mutations_1.MutationType.UNSET: {
                target = Object.assign({}, target);
                delete target[mutation.propertyName];
                break;
            }
        }
        newValue = setDeepValue(newValue, target, mutation.path);
    }
    return newValue;
};
//# sourceMappingURL=patch.js.map