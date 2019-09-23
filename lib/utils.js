"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arraySplice = function (target, index, count) {
    if (count === void 0) { count = 1; }
    var replacements = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        replacements[_i - 3] = arguments[_i];
    }
    return __spreadArrays(target.slice(0, index), replacements, target.slice(index + count));
};
exports.getValue = function (object, keyPath) {
    return keyPath.reduce(function (value, part) {
        return value && value[part];
    }, object);
};
exports.setValue = function (object, value, keyPath, currentIndex) {
    var _a;
    if (currentIndex === void 0) { currentIndex = 0; }
    if (currentIndex === keyPath.length) {
        return value;
    }
    var key = keyPath[currentIndex];
    if (Array.isArray(object)) {
        return exports.arraySplice(object, Number(key), 1, exports.setValue(object[key], value, keyPath, currentIndex + 1));
    }
    else {
        return __assign(__assign({}, object), (_a = {}, _a[key] = exports.setValue(object[key], value, keyPath, currentIndex + 1), _a));
    }
};
//# sourceMappingURL=utils.js.map