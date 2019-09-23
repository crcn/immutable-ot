"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("..");
var utils_1 = require("./utils");
describe(__filename + "#", function () {
    Array
        .from({ length: 200 })
        .map(function () { return [
        utils_1.generateRandomNode(5, 7, 5),
        utils_1.generateRandomNode(5, 7, 5)
    ]; })
        .forEach(function (_a) {
        var a = _a[0], b = _a[1];
        it("Can diff & patch " + JSON.stringify(a) + " to " + JSON.stringify(b), function () {
            var now = Date.now();
            var diffs = __1.diff(a, b);
            var c = __1.patch(a, diffs);
            chai_1.expect(c).to.eql(b);
        });
    });
});
//# sourceMappingURL=fuzzy-test.js.map