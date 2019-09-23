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
Object.defineProperty(exports, "__esModule", { value: true });
var mutations_1 = require("./mutations");
var utils_1 = require("./utils");
exports.patch = function (oldValue, mutations) {
    var _a;
    var newValue = oldValue;
    for (var i = 0, n = mutations.length; i < n; i++) {
        var mutation = mutations[i];
        var target = utils_1.getValue(newValue, mutation.path);
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
                var value = target[mutation.oldIndex];
                target = utils_1.arraySplice(target, mutation.oldIndex, 1);
                target = utils_1.arraySplice(target, mutation.newIndex, 0, value);
                break;
            }
            case mutations_1.MutationType.SET: {
                target = __assign(__assign({}, target), (_a = {}, _a[mutation.propertyName] = mutation.value, _a));
                break;
            }
            case mutations_1.MutationType.UNSET: {
                target = __assign({}, target);
                delete target[mutation.propertyName];
                break;
            }
        }
        newValue = utils_1.setValue(newValue, target, mutation.path);
    }
    return newValue;
};
//# sourceMappingURL=patch.js.map