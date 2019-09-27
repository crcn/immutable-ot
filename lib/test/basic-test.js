"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const chai_1 = require("chai");
const mutations_1 = require("../mutations");
const patch_1 = require("../patch");
describe(__filename + "#", () => {
    it("replaces values that don't share the same constructor", () => {
        class P {
            constructor(props) {
                Object.assign(this, props);
            }
        }
        class A extends P {
        }
        class B extends P {
        }
        const state = {
            prop: new A({ value: "something" })
        };
        const mutations = __1.diff(state, Object.assign(Object.assign({}, state), { prop: new B({ value: "blarg" }) }));
        chai_1.expect(mutations.length).to.eql(1);
        chai_1.expect(mutations[0].type).to.eql(mutations_1.MutationType.REPLACE);
        chai_1.expect(mutations[0].path).to.eql(["prop"]);
        const newState = patch_1.patch(state, mutations);
        chai_1.expect(newState.prop.constructor).to.eql(B);
        chai_1.expect(newState.prop.value).to.eql("blarg");
    });
});
//# sourceMappingURL=basic-test.js.map