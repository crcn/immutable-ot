import {diff} from "..";
import {expect} from "chai";
import { MutationType, replace } from "../mutations";
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
    expect(mutations).to.eql([replace(newItem[0], [0])])
  });
});