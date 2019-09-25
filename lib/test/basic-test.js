"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __1 = require("..");
var chai_1 = require("chai");
var mutations_1 = require("../mutations");
var patch_1 = require("../patch");
describe(__filename + "#", function () {
    it("replaces values that don't share the same constructor", function () {
        var P = /** @class */ (function () {
            function P(props) {
                Object.assign(this, props);
            }
            return P;
        }());
        var A = /** @class */ (function (_super) {
            __extends(A, _super);
            function A() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return A;
        }(P));
        var B = /** @class */ (function (_super) {
            __extends(B, _super);
            function B() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return B;
        }(P));
        var state = {
            prop: new A({ value: "something" })
        };
        var mutations = __1.diff(state, __assign(__assign({}, state), { prop: new B({ value: "blarg" }) }));
        chai_1.expect(mutations.length).to.eql(1);
        chai_1.expect(mutations[0].type).to.eql(mutations_1.MutationType.REPLACE);
        chai_1.expect(mutations[0].path).to.eql(["prop"]);
        var newState = patch_1.patch(state, mutations);
        chai_1.expect(newState.prop.constructor).to.eql(B);
        chai_1.expect(newState.prop.value).to.eql("blarg");
    });
});
//# sourceMappingURL=basic-test.js.map