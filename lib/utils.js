"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arraySplice = (target, index, count = 1, ...replacements) => [
    ...target.slice(0, index),
    ...replacements,
    ...target.slice(index + count)
];
exports.getValue = (object, keyPath) => {
    return keyPath.reduce((value, part) => {
        return value && value[part];
    }, object);
};
exports.setValue = (object, value, keyPath, currentIndex = 0) => {
    if (currentIndex === keyPath.length) {
        return value;
    }
    const key = keyPath[currentIndex];
    if (Array.isArray(object)) {
        return exports.arraySplice(object, Number(key), 1, exports.setValue(object[key], value, keyPath, currentIndex + 1));
    }
    else {
        return Object.assign(Object.assign({}, object), { [key]: exports.setValue(object[key], value, keyPath, currentIndex + 1) });
    }
};
//# sourceMappingURL=utils.js.map