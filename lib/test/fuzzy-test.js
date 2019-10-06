"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("..");
const utils_1 = require("./utils");
describe(__filename + "#", () => {
    return;
    Array
        .from({ length: 100 })
        .map(() => [
        utils_1.generateRandomNode(5, 5, 5),
        utils_1.generateRandomNode(5, 5, 5)
    ])
        .forEach(([a, b]) => {
        it(`Can diff & patch ${JSON.stringify(a)} to ${JSON.stringify(b)}`, () => {
            const now = Date.now();
            const diffs = __1.diff(a, b);
            const c = __1.patch(a, diffs);
            chai_1.expect(c).to.eql(b);
        });
    });
});
//# sourceMappingURL=fuzzy-test.js.map