import {diff} from "..";
import {expect} from "chai";
import { MutationType, replace, remove, insert, set } from "../mutations";
import { patch } from "../patch";
import { defaultAdapter } from "../diff";
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

    const state: any = {
      prop: new A({ value: "something" })
    };


    const mutations = diff(state, {
      ...state,
      prop: new B({ value: "blarg" })
    });

    expect(mutations.length).to.eql(1);
    expect(mutations[0].type).to.eql(MutationType.REPLACE);
    expect(mutations[0].path).to.eql(["prop"]);

    const newState = patch(state, mutations);
    expect(newState.prop.constructor).to.eql(B);
    expect(newState.prop.value).to.eql("blarg");
  });

  it("can use a custom equals option", () => {
    const adapter = {
      ...defaultAdapter,
      typeEquals(a, b) {
        return a.type === b.type;
      }
    };

    const oldItem = [{type: "a"}];
    const newItem = [{type: "b"}];

    const mutations = diff(oldItem, newItem, { adapter });
    expect(mutations).to.eql([remove(0, []), insert(0, newItem[0], [])])
  });



  it("can use a custom diffable option", () => {
    const adapter = {
      ...defaultAdapter,
      diffable(a, b) {
        return a.id === b.id;
      }
    };

    const oldItem = [{id: "a"}];
    const newItem = [{id: "b"}];

    const mutations = diff(oldItem, newItem, { adapter });
    expect(mutations).to.eql([remove(0, []), insert(0, newItem[0], [])])
  });


  it("can use a custom diffable option 2", () => {
    const adapter = {
      ...defaultAdapter,
      diffable(a, b) {
        return a.id === b.id;
      }
    };

    const oldItem = [{id: "a", name: "b"}];
    const newItem = [{id: "a", name: "a"}];

    const mutations = diff(oldItem, newItem, { adapter });
    expect(mutations).to.eql([set("name", "a", [0])])
  });
});