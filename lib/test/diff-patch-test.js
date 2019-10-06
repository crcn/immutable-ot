"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("..");
describe(__filename + "#", () => {
    [
        [[0], [0, 1], [__1.MutationType.INSERT]],
        [[0, 2, 3], [0, 1], [__1.MutationType.REMOVE, __1.MutationType.INSERT, __1.MutationType.REMOVE]],
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
    ].forEach(([a, b, mutationTypes]) => {
        it(`can diff & patch ${JSON.stringify(a)} to ${JSON.stringify(b)}`, () => {
            const mutations = __1.diff(a, b);
            const c = __1.patch(a, mutations);
            chai_1.expect(c).to.eql(b);
            chai_1.expect(mutations.map(({ type }) => type)).to.eql(mutationTypes);
        });
    });
});
//# sourceMappingURL=diff-patch-test.js.map