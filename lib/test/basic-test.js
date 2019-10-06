"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const chai_1 = require("chai");
const mutations_1 = require("../mutations");
const patch_1 = require("../patch");
const diff_1 = require("../diff");
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
    it("can use a custom type equals option", () => {
        const adapter = Object.assign(Object.assign({}, diff_1.defaultAdapter), { typeEquals(a, b) {
                return a.type === b.type;
            } });
        const oldItem = [{ type: "a" }];
        const newItem = [{ type: "b" }];
        const mutations = __1.diff(oldItem, newItem, { adapter });
        chai_1.expect(mutations).to.eql([mutations_1.remove(0, []), mutations_1.insert(0, newItem[0], [])]);
    });
    it("can use a custom diffable option", () => {
        const adapter = Object.assign(Object.assign({}, diff_1.defaultAdapter), { equals(a, b) {
                return a.id === b.id;
            },
            diffable(a, b) {
                return a.id === b.id;
            } });
        const oldItem = [{ id: "a" }];
        const newItem = [{ id: "b" }];
        const mutations = __1.diff(oldItem, newItem, { adapter });
        chai_1.expect(mutations).to.eql([mutations_1.remove(0, []), mutations_1.insert(0, newItem[0], [])]);
    });
    it("can use a custom equals option 2", () => {
        const adapter = Object.assign(Object.assign({}, diff_1.defaultAdapter), { equals(a, b) {
                return a.id === b.id;
            } });
        const oldItem = [{ id: "a", name: "b" }];
        const newItem = [{ id: "a", name: "a" }];
        const mutations = __1.diff(oldItem, newItem, { adapter });
        chai_1.expect(mutations).to.eql([mutations_1.set("name", "a", [0])]);
    });
});
//# sourceMappingURL=basic-test.js.map