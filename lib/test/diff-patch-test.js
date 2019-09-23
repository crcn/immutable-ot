"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("..");
describe(__filename + "#", function () {
    [
        [[0], [0, 1], [__1.MutationType.INSERT]],
        [[0, 2, 3], [0, 1], [__1.MutationType.REPLACE, __1.MutationType.REMOVE]],
        [
            [0, 1, 2, 3],
            [3, 2, 1, 0],
            [__1.MutationType.MOVE, __1.MutationType.MOVE, __1.MutationType.MOVE]
        ],
        [{ a: "b" }, { a: "c" }, [__1.MutationType.SET]],
        [
            [{ a: "c", b: "c" }],
            [{ a: "d", b: "e" }],
            [__1.MutationType.SET, __1.MutationType.SET]
        ]
    ].forEach(function (_a) {
        var a = _a[0], b = _a[1], mutationTypes = _a[2];
        it("can diff & patch " + JSON.stringify(a) + " to " + JSON.stringify(b), function () {
            var mutations = __1.diff(a, b);
            var c = __1.patch(a, mutations);
            chai_1.expect(c).to.eql(b);
            chai_1.expect(mutations.map(function (_a) {
                var type = _a.type;
                return type;
            })).to.eql(mutationTypes);
        });
    });
});
//# sourceMappingURL=diff-patch-test.js.map