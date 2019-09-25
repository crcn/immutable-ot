import {diff} from "..";
import {expect} from "chai";
import { MutationType } from "../mutations";
import { patch } from "../patch";
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
});